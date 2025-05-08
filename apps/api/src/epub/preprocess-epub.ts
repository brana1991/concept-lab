import * as fs from 'fs/promises';
import * as path from 'path';
import * as cheerio from 'cheerio';
import extract from 'extract-zip';
import * as os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Manifest {
  title: string;
  author: string;
  chapters: string[];
  css: string;
  cover: string;
}

async function extractEpub(epubPath: string): Promise<string> {
  // Create base output directory
  const baseOutputDir = path.join(__dirname, 'output');
  await fs.mkdir(baseOutputDir, { recursive: true });

  // Use the original filename (without extension) as directory name
  const bookDirName = path.basename(epubPath, path.extname(epubPath));
  const outputDir = path.join(baseOutputDir, bookDirName);

  try {
    await fs.rm(outputDir, { recursive: true, force: true });
  } catch (error) {
    // Ignore error if directory doesn't exist
  }
  await fs.mkdir(outputDir);
  await extract(epubPath, { dir: outputDir });
  return outputDir;
}

async function findContentOpf(epubDir: string): Promise<string> {
  console.log('\nSearching for OPF file...');
  console.log('Root directory contents:', await fs.readdir(epubDir));

  // First try OEBPS directory (standard EPUB structure)
  const oebpsDir = path.join(epubDir, 'OEBPS');
  try {
    const files = await fs.readdir(oebpsDir);
    console.log('OEBPS directory contents:', files);
    const opfFile = files.find((f) => f.endsWith('.opf'));
    if (opfFile) {
      console.log('Found OPF in OEBPS:', opfFile);
      return path.join(oebpsDir, opfFile);
    }
  } catch (error) {
    console.log('OEBPS directory not found, trying root directory');
  }

  // Try root directory
  const files = await fs.readdir(epubDir);
  const opfFile = files.find((f) => f.endsWith('.opf'));
  if (opfFile) {
    console.log('Found OPF in root:', opfFile);
    return path.join(epubDir, opfFile);
  }

  throw new Error('content.opf not found in EPUB directory');
}

async function findChaptersDir(baseDir: string): Promise<string> {
  console.log('\nSearching for chapter files...');
  console.log('Base directory:', baseDir);

  // First, let's see what's in the base directory
  const baseContents = await fs.readdir(baseDir);
  console.log('Base directory contents:', baseContents);

  // Try common chapter directory names (case-insensitive)
  const possibleDirs = ['chapters', 'text', 'xhtml', 'html', 'content', 'Text'];

  for (const dirName of possibleDirs) {
    const dirPath = path.join(baseDir, dirName);
    try {
      const files = await fs.readdir(dirPath);
      console.log(`\nChecking ${dirPath}:`, files);
      if (files.some((f) => f.endsWith('.xhtml') || f.endsWith('.html'))) {
        console.log(`Found chapters in ${dirPath}`);
        return dirPath;
      }
    } catch (error) {
      // Directory doesn't exist, try next
    }
  }

  // If no standard directory found, search recursively
  console.log('Searching for XHTML files recursively...');
  const xhtmlFiles = await findXhtmlFiles(baseDir);
  console.log('Found XHTML files:', xhtmlFiles);

  if (xhtmlFiles.length > 0) {
    const firstFile = xhtmlFiles[0];
    const chaptersDir = path.dirname(firstFile);
    console.log(`Using directory containing first XHTML file: ${chaptersDir}`);
    return chaptersDir;
  }

  throw new Error('No chapter directory found');
}

async function findXhtmlFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findXhtmlFiles(fullPath)));
    } else if (entry.name.endsWith('.xhtml') || entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
}

async function extractMetadata(opfPath: string): Promise<{ title: string; author: string }> {
  const opfContent = await fs.readFile(opfPath, 'utf-8');
  const $ = cheerio.load(opfContent, { xmlMode: true });

  const title = $('dc\\:title').first().text() || 'Unknown Title';
  const author = $('dc\\:creator').first().text() || 'Unknown Author';

  return { title, author };
}

function generateId(prefix: string, counter: number): string {
  return `${prefix}-${counter.toString().padStart(5, '0')}`;
}

async function processChapter(filePath: string, chapterPrefix: string): Promise<number> {
  console.log(`\nProcessing chapter: ${filePath}`);
  const content = await fs.readFile(filePath, 'utf-8');
  console.log('\n=== Original HTML Preview ===');
  console.log(content.substring(0, 1000));

  const $ = cheerio.load(content, {
    xmlMode: true,
    decodeEntities: false,
  });
  let idCounter = 1;

  // Process elements that need IDs
  const elementsToProcess = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'img'];
  elementsToProcess.forEach((selector) => {
    const elements = $(selector);
    console.log(`\n=== Processing ${selector} elements ===`);
    console.log(`Found ${elements.length} elements`);

    if (elements.length > 0) {
      // Show the first few elements' HTML structure
      elements.slice(0, 3).each((i, element) => {
        console.log(`\nElement ${i + 1}:`);
        console.log($(element).prop('outerHTML'));
      });
    }

    elements.each((_, element) => {
      if (!$(element).attr('id')) {
        const newId = generateId(chapterPrefix, idCounter++);
        $(element).attr('id', newId);
        console.log(`Added ID ${newId} to element`);
      } else {
        console.log(`Element already has ID: ${$(element).attr('id')}`);
      }
    });
  });

  // Fix relative paths
  $('link[href^="../css/"]').attr('href', (_, href) => String(href).replace('../css/', 'css/'));
  $('link[href^="../images/"]').attr('href', (_, href) =>
    String(href).replace('../images/', 'images/'),
  );
  $('a[href^="../chapters/"]').attr('href', (_, href) =>
    String(href).replace('../chapters/', 'chapters/'),
  );
  $('img[src^="../images/"]').attr('src', (_, src) => String(src).replace('../images/', 'images/'));

  const processedContent = $.html();
  console.log('\n=== Processed HTML Preview ===');
  console.log(processedContent.substring(0, 1000));

  await fs.writeFile(filePath, processedContent);
  return idCounter - 1;
}

async function main() {
  if (process.argv.length < 3) {
    console.error('Usage: ts-node preprocess-epub.ts <epub-file>');
    process.exit(1);
  }

  const epubPath = process.argv[2];
  let outputDir: string | undefined;

  try {
    // First extract to a temporary directory to get metadata
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'epub-'));
    await extract(epubPath, { dir: tempDir });

    // Get book title from OPF
    const opfPath = await findContentOpf(tempDir);
    const { title, author } = await extractMetadata(opfPath);

    // Clean up temp directory
    await fs.rm(tempDir, { recursive: true, force: true });

    // Now extract to the proper directory with the book title
    console.log('Extracting EPUB...');
    outputDir = await extractEpub(epubPath);
    console.log('Extracted to:', outputDir);

    // Find and validate content.opf in the new location
    const finalOpfPath = await findContentOpf(outputDir);
    console.log('Found OPF file:', finalOpfPath);

    // Find chapters directory
    const chaptersDir = await findChaptersDir(path.dirname(finalOpfPath));
    const chapterFiles = (await fs.readdir(chaptersDir))
      .filter((f) => f.endsWith('.xhtml') || f.endsWith('.html'))
      .sort();

    const manifest: Manifest = {
      title,
      author,
      chapters: [],
      css: 'css/book.css',
      cover: 'images/cover.jpg',
    };

    console.log('\nProcessing chapters...');
    for (const file of chapterFiles) {
      const filePath = path.join(chaptersDir, file);
      const chapterPrefix = path.basename(file, path.extname(file));
      const idsAdded = await processChapter(filePath, chapterPrefix);

      console.log(`${file}: Added ${idsAdded} IDs`);
      manifest.chapters.push(`chapters/${file}`);
    }

    // Write manifest
    const manifestPath = path.join(outputDir, 'manifest.json');
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('\nManifest written to:', manifestPath);
    console.log('\nAll processed files are in:', outputDir);
    console.log('\nBook directory name:', path.basename(outputDir));
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
