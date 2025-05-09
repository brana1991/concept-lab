import * as fs from 'fs/promises';
import * as path from 'path';
import * as cheerio from 'cheerio';
import extract from 'extract-zip';
import * as os from 'os';
import { fileURLToPath } from 'url';
import { EPUBService } from './epub.service';
import { Pool } from 'pg';
import { EpubCFI } from 'epubjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STATIC_BASE_URL = 'http://localhost:3000';

interface ManifestItem {
  id: string;
  href?: string;
  'media-type': string;
  title?: string;
}

interface SpineItem {
  idref: string;
  linear?: string;
}

interface OPFData {
  metadata: {
    title?: string;
    creator?: string;
    [key: string]: any;
  };
  manifest: ManifestItem[];
  spine: SpineItem[];
}

// Initialize database connection
const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'flipbook',
  port: Number(process.env.PGPORT) || 5432,
});

const epubService = new EPUBService(pool);

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

async function extractMetadata(opfPath: string): Promise<{ title: string | undefined; author: string | undefined }> {
  const opfContent = await fs.readFile(opfPath, 'utf-8');
  const $ = cheerio.load(opfContent, { xmlMode: true });

  const title = $('dc\\:title').first().text() || undefined;
  const author = $('dc\\:creator').first().text() || undefined;

  return { title, author };
}

function generateId(prefix: string, counter: number): string {
  return `${prefix}-${counter.toString().padStart(5, '0')}`;
}

async function processChapter(filePath: string, chapterPrefix: string): Promise<number> {
  console.log(`\nProcessing chapter: ${filePath}`);
  // Decode URL-encoded file path
  const decodedFilePath = decodeURIComponent(filePath);
  const content = await fs.readFile(decodedFilePath, 'utf-8');
  console.log('\n=== Original HTML Preview ===');
  console.log(content.substring(0, 1000));

  const $ = cheerio.load(content, {
    xmlMode: true,
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

  // Fix OEBPS paths to be absolute
  const bookDir = path.basename(path.dirname(path.dirname(path.dirname(decodedFilePath))));
  
  // Handle img and link tags
  $('img').each((_, el) => {
    const src = $(el).attr('src');
    if (src && typeof src === 'string') {
      const filename = path.basename(src);
      if (filename) {
        $(el).attr('src', `${STATIC_BASE_URL}/epub/${bookDir}/OEBPS/Images/${filename}`);
      }
    }
  });

  // Handle SVG image elements
  $('svg image').each((_, el) => {
    const href = $(el).attr('xlink:href');
    if (href && typeof href === 'string') {
      const filename = path.basename(href);
      if (filename) {
        $(el).attr('xlink:href', `${STATIC_BASE_URL}/epub/${bookDir}/OEBPS/Images/${filename}`);
      }
    }
  });

  $('link').each((_, el) => {
    const href = $(el).attr('href');
    if (href && typeof href === 'string') {
      const filename = path.basename(href);
      if (filename) {
        $(el).attr('href', `${STATIC_BASE_URL}/epub/${bookDir}/OEBPS/Styles/${filename}`);
      }
    }
  });

  const processedContent = $.html();
  console.log('\n=== Processed HTML Preview ===');
  console.log(processedContent.substring(0, 1000));

  // Create the output directory structure
  const outputDir = path.join(__dirname, 'output', bookDir, 'OEBPS', 'Text');
  await fs.mkdir(outputDir, { recursive: true });

  // Write to the output directory instead of the original file
  const outputPath = path.join(outputDir, path.basename(decodedFilePath));
  await fs.writeFile(outputPath, processedContent);
  return idCounter - 1;
}

async function findStylesFiles(baseDir: string): Promise<string[]> {
  const stylesDir = path.join(baseDir, 'OEBPS', 'Styles');
  try {
    const files = await fs.readdir(stylesDir);
    const cssFiles = files.filter(f => f.endsWith('.css'));
    if (cssFiles.length === 0) {
      throw new Error('No CSS files found in Styles directory');
    }
    return cssFiles;
  } catch (error) {
    console.error('Error finding CSS files:', error);
    throw error;
  }
}

async function parseOPF(content: string): Promise<OPFData> {
  const $ = cheerio.load(content, { xmlMode: true });

  // Parse metadata
  const metadata = {
    title: $('metadata > dc\\:title').first().text() || undefined,
    creator: $('metadata > dc\\:creator').first().text() || undefined,
  };

  // Parse manifest
  const manifest: ManifestItem[] = [];
  $('manifest > item').each((_, el) => {
    const $el = $(el);
    const id = $el.attr('id');
    const href = $el.attr('href');
    const mediaType = $el.attr('media-type');
    const title = $el.attr('title');
    
    if (id && mediaType) {
      manifest.push({
        id,
        href: href || undefined,
        'media-type': mediaType,
        title: title || undefined
      });
    }
  });

  // Parse spine and update manifest items with titles
  const spine: SpineItem[] = [];
  $('spine > itemref').each((_, el) => {
    const $el = $(el);
    const idref = $el.attr('idref');
    const linear = $el.attr('linear');
    
    if (idref) {
      // Find the corresponding manifest item
      const manifestItem = manifest.find(m => m.id === idref);
      if (manifestItem) {
        // If the manifest item doesn't have a title, try to get it from the spine
        if (!manifestItem.title) {
          const title = $el.attr('title');
          if (title) {
            manifestItem.title = title;
          }
        }
      }
      
      spine.push({
        idref,
        linear: linear || undefined
      });
    }
  });

  return {
    metadata,
    manifest,
    spine
  };
}

async function copyChapterFiles(extractedDir: string, outputDir: string): Promise<void> {
  // Create necessary directories
  const textDir = path.join(outputDir, 'OEBPS', 'Text');
  const stylesDir = path.join(outputDir, 'OEBPS', 'Styles');
  const imagesDir = path.join(outputDir, 'OEBPS', 'Images');

  await fs.mkdir(textDir, { recursive: true });
  await fs.mkdir(stylesDir, { recursive: true });
  await fs.mkdir(imagesDir, { recursive: true });

  // Copy Text files
  const sourceTextDir = path.join(extractedDir, 'OEBPS', 'Text');
  const textFiles = await fs.readdir(sourceTextDir);
  for (const file of textFiles) {
    if (file.endsWith('.html') || file.endsWith('.xhtml')) {
      await fs.copyFile(
        path.join(sourceTextDir, file),
        path.join(textDir, file)
      );
    }
  }

  // Copy Styles
  const sourceStylesDir = path.join(extractedDir, 'OEBPS', 'Styles');
  const styleFiles = await fs.readdir(sourceStylesDir);
  for (const file of styleFiles) {
    if (file.endsWith('.css')) {
      await fs.copyFile(
        path.join(sourceStylesDir, file),
        path.join(stylesDir, file)
      );
    }
  }

  // Copy Images
  const sourceImagesDir = path.join(extractedDir, 'OEBPS', 'Images');
  const imageFiles = await fs.readdir(sourceImagesDir);
  for (const file of imageFiles) {
    await fs.copyFile(
      path.join(sourceImagesDir, file),
      path.join(imagesDir, file)
    );
  }
}

async function preprocessEPUB(filePath: string) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'epub-'));
  const outputDir = path.join(__dirname, 'output', path.basename(filePath, '.epub'));

  try {
    // Extract EPUB
    const extractedDir = await extractEpub(filePath);
    
    // Read OPF file
    const opfPath = await findContentOpf(extractedDir);
    const opfContent = await fs.readFile(opfPath, 'utf-8');
    
    // Parse OPF
    const { metadata, manifest, spine } = await parseOPF(opfContent);
    
    // Create document in database
    const timestamp = Date.now();
    const manifestUrl = `${STATIC_BASE_URL}/epub/${path.basename(outputDir)}/manifest-${timestamp}.json`;
    const document = await epubService.createDocument(
      String(metadata.title ?? path.basename(filePath, '.epub')),
      String(metadata.creator ?? 'Unknown Author'),
      manifestUrl
    );

    // Copy all necessary files to output directory
    await copyChapterFiles(extractedDir, outputDir);

    // Process chapters and create them in database
    const chapters = await Promise.all(
      spine.map(async (item, index) => {
        const manifestItem = manifest.find(m => m.id === item.idref);
        if (!manifestItem?.href) return null;

        const chapterPath = path.join(outputDir, 'OEBPS', 'Text', path.basename(manifestItem.href));
        const processedContent = await processChapter(chapterPath, path.basename(manifestItem.href, path.extname(manifestItem.href)));

        // Use the spine index for chapter order
        const chapter = await epubService.createChapter(
          document.id,
          manifestItem.title ?? `Chapter ${index + 1}`,
          `${STATIC_BASE_URL}/epub/${path.basename(outputDir)}/OEBPS/Text/${path.basename(manifestItem.href)}`,
          index + 1  // This will now match the spine order
        );

        return chapter;
      })
    );

    // Update total chapters count
    await epubService.updateDocumentChapters(document.id, chapters.filter(Boolean).length);

    // Find chapters directory
    const chaptersDir = path.join(outputDir, 'OEBPS', 'Text');
    const chapterFiles = (await fs.readdir(chaptersDir))
      .filter((f) => f.endsWith('.xhtml') || f.endsWith('.html'))
      .sort();

    // Find the CSS files
    const cssFiles = await findStylesFiles(outputDir);
    console.log('Found CSS files:', cssFiles);

    // Create manifest in the expected format
    const epubManifest = {
      id: document.id,
      title: document.title,
      author: document.author,
      epubPath: manifestUrl,
      // Use spine order for chapters
      chapters: spine
        .map(item => {
          const manifestItem = manifest.find(m => m.id === item.idref);
          return manifestItem?.href 
            ? `${STATIC_BASE_URL}/epub/${path.basename(outputDir)}/OEBPS/Text/${path.basename(manifestItem.href)}`
            : null;
        })
        .filter((url): url is string => url !== null),
      css: cssFiles.map(file => 
        `${STATIC_BASE_URL}/epub/${path.basename(outputDir)}/OEBPS/Styles/${file}`
      ),
      cover: `${STATIC_BASE_URL}/epub/${path.basename(outputDir)}/OEBPS/Images/cover.jpg`,
      createdAt: new Date().toISOString()
    };

    // Write manifest
    const manifestPath = path.join(outputDir, `manifest-${timestamp}.json`);
    await fs.writeFile(manifestPath, JSON.stringify(epubManifest, null, 2));
    console.log('\nManifest written to:', manifestPath);
    console.log('\nAll processed files are in:', outputDir);
    console.log('\nBook directory name:', path.basename(outputDir));

    return outputDir;
  } catch (error) {
    console.error('Error preprocessing EPUB:', error);
    throw error;
  } finally {
    // Clean up temp directory
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

async function main() {
  if (process.argv.length < 3) {
    console.error('Usage: ts-node preprocess-epub.ts <epub-file>');
    process.exit(1);
  }

  const epubPath = process.argv[2];

  try {
    const outputDir = await preprocessEPUB(epubPath);
    console.log('Successfully processed EPUB. Output directory:', outputDir);
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
