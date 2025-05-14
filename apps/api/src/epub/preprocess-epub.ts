import * as fs from 'fs/promises';
import * as path from 'path';
import * as cheerio from 'cheerio';
import extract from 'extract-zip';
import * as os from 'os';
import { fileURLToPath } from 'url';
import { EPUBService } from './epub.service';
import { Pool } from 'pg';

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

interface GuideReference {
  type: string;
  title?: string;
  href: string;
}

interface OPFData {
  metadata: {
    title?: string;
    creator?: string;
    [key: string]: any;
  };
  manifest: ManifestItem[];
  spine: SpineItem[];
  guide?: GuideReference[];
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
  console.log(`[extractEpub] Received epubPath: ${epubPath}`);
  const baseOutputDir = path.join(__dirname, 'output');
  await fs.mkdir(baseOutputDir, { recursive: true });
  const bookDirName = path.basename(epubPath, path.extname(epubPath));
  console.log(`[extractEpub] Derived bookDirName: ${bookDirName}`);
  const outputDir = path.join(baseOutputDir, bookDirName);
  console.log(`[extractEpub] Attempting to create outputDir: ${outputDir}`);
  try {
    await fs.rm(outputDir, { recursive: true, force: true });
  } catch (error) {
    // Ignore
  }
  await fs.mkdir(outputDir);
  console.log(`[extractEpub] Successfully created/ensured outputDir: ${outputDir}`);
  console.log(`[extractEpub] Attempting to extract ${epubPath} to ${outputDir}`);
  await extract(epubPath, { dir: outputDir });
  console.log(`[extractEpub] Successfully extracted EPUB to: ${outputDir}`);
  return outputDir;
}

async function findContentOpf(epubDir: string): Promise<string> {
  console.log(`[findContentOpf] Searching in epubDir: ${epubDir}`);
  const oebpsDir = path.join(epubDir, 'OEBPS');
  try {
    const filesInOebps = await fs.readdir(oebpsDir);
    console.log('[findContentOpf] OEBPS directory contents:', filesInOebps);
    const opfFile = filesInOebps.find((f) => f.endsWith('.opf'));
    if (opfFile) {
      console.log('[findContentOpf] Found OPF in OEBPS:', opfFile);
      return path.join(oebpsDir, opfFile);
    }
  } catch (error) {
    console.log(
      '[findContentOpf] OEBPS directory not found or error reading, trying root directory of epubDir:',
      error,
    );
  }
  console.log('[findContentOpf] Trying root directory of epubDir for OPF.');
  const filesInEpubDir = await fs.readdir(epubDir);
  console.log('[findContentOpf] epubDir (root) contents:', filesInEpubDir);
  const opfFile = filesInEpubDir.find((f) => f.endsWith('.opf'));
  if (opfFile) {
    console.log('[findContentOpf] Found OPF in root of epubDir:', opfFile);
    return path.join(epubDir, opfFile);
  }
  throw new Error(`content.opf not found in ${epubDir} or its OEBPS subdirectory`);
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

async function extractMetadata(
  opfPath: string,
): Promise<{ title: string | undefined; author: string | undefined }> {
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
  const decodedFilePath = decodeURIComponent(filePath);
  console.log(`[processChapter] Attempting to read decodedFilePath: ${decodedFilePath}`);
  const content = await fs.readFile(decodedFilePath, 'utf-8');
  const $ = cheerio.load(content, { xmlMode: true });
  let idCounter = 1;
  const elementsToProcess = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'img'];
  elementsToProcess.forEach((selector) => {
    const elements = $(selector);
    elements.each((_, element) => {
      if (!$(element).attr('id')) {
        $(element).attr('id', generateId(chapterPrefix, idCounter++));
      }
    });
  });
  const bookDir = path.basename(path.dirname(path.dirname(path.dirname(decodedFilePath))));
  $('img').each((_, el) => {
    const src = $(el).attr('src');
    if (src && typeof src === 'string') {
      const filename = path.basename(src);
      if (filename) {
        $(el).attr('src', `${STATIC_BASE_URL}/epub/${bookDir}/OEBPS/Images/${filename}`);
      }
    }
  });
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
  const outputTextDir = path.join(__dirname, 'output', bookDir, 'OEBPS', 'Text');
  await fs.mkdir(outputTextDir, { recursive: true });
  const outputPath = path.join(outputTextDir, path.basename(decodedFilePath));
  console.log(`[processChapter] Writing processed chapter to: ${outputPath}`);
  await fs.writeFile(outputPath, processedContent);
  return idCounter - 1;
}

async function findStylesFiles(targetBookOutputDir: string): Promise<string[]> {
  const stylesDir = path.join(targetBookOutputDir, 'OEBPS', 'Styles');
  console.log(`[findStylesFiles] Looking for CSS files in: ${stylesDir}`);
  try {
    const files = await fs.readdir(stylesDir);
    const cssFiles = files.filter((f) => f.endsWith('.css'));
    if (cssFiles.length === 0) {
      console.warn(`[findStylesFiles] No CSS files found in ${stylesDir}`);
      return [];
    }
    console.log(`[findStylesFiles] Found CSS files: ${cssFiles.join(', ')}`);
    return cssFiles;
  } catch (error) {
    console.error(`[findStylesFiles] Error finding CSS files in ${stylesDir}:`, error);
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      console.warn(`[findStylesFiles] Styles directory not found: ${stylesDir}`);
      return [];
    }
    throw error;
  }
}

async function parseOPF(content: string): Promise<OPFData & { coverHref?: string }> {
  const $ = cheerio.load(content, { xmlMode: true });
  const metadata = {
    title: $('metadata > dc\\:title').first().text() || undefined,
    creator: $('metadata > dc\\:creator').first().text() || undefined,
  };
  let coverHref: string | undefined = undefined;
  const coverMeta = $('metadata > meta[name="cover"]');
  if (coverMeta.length > 0) {
    const coverId = coverMeta.attr('content');
    if (coverId) {
      const coverItem = $(`manifest > item[id="${coverId}"]`);
      if (coverItem.length > 0) coverHref = coverItem.attr('href');
    }
  }
  const manifest: ManifestItem[] = [];
  $('manifest > item').each((_, el) => {
    const $el = $(el);
    const id = $el.attr('id');
    const href = $el.attr('href');
    const mediaType = $el.attr('media-type');
    const title = $el.attr('title');
    const properties = $el.attr('properties');
    if (id && mediaType)
      manifest.push({
        id,
        href: href || undefined,
        'media-type': mediaType,
        title: title || undefined,
      });
    if (!coverHref && properties && properties.includes('cover-image')) coverHref = href;
    if (
      !coverHref &&
      href &&
      mediaType &&
      mediaType.startsWith('image/') &&
      href.toLowerCase().includes('cover.')
    )
      coverHref = href;
  });
  const spine: SpineItem[] = [];
  $('spine > itemref').each((_, el) => {
    const $el = $(el);
    const idref = $el.attr('idref');
    const linear = $el.attr('linear');
    if (idref) {
      const manifestItem = manifest.find((m) => m.id === idref);
      if (manifestItem && !manifestItem.title) {
        const title = $el.attr('title');
        if (title) manifestItem.title = title;
      }
      spine.push({ idref, linear: linear || undefined });
    }
  });
  const guide: GuideReference[] = [];
  $('guide > reference').each((_, el) => {
    const href = $(el).attr('href');
    const type = $(el).attr('type');
    if (href && type) guide.push({ type, title: $(el).attr('title') || undefined, href });
  });
  return { metadata, manifest, spine, coverHref, guide };
}

async function copyFilesToStandardizedLocations(
  sourceEpubExtractedRootDir: string,
  targetBookOutputDir: string,
  manifestItems: ManifestItem[],
  opfFilePath: string,
): Promise<void> {
  console.log(`[copyFilesToStandardizedLocations] Source Root: ${sourceEpubExtractedRootDir}`);
  console.log(`[copyFilesToStandardizedLocations] Target Root: ${targetBookOutputDir}`);
  const opfParentDir = path.dirname(opfFilePath);
  console.log(`[copyFilesToStandardizedLocations] OPF Parent Dir: ${opfParentDir}`);

  for (const item of manifestItems) {
    if (!item.href) {
      console.warn(
        `[copyFilesToStandardizedLocations] Manifest item ${item.id} has no href, skipping.`,
      );
      continue;
    }

    const sourcePath = path.resolve(opfParentDir, item.href);

    let targetSubDir = '';
    const mediaType = item['media-type'];
    const itemHref = item.href;

    if (mediaType === 'application/xhtml+xml') {
      targetSubDir = 'Text';
    } else if (mediaType === 'text/css') {
      targetSubDir = 'Styles';
    } else if (mediaType && mediaType.startsWith('image/')) {
      targetSubDir = 'Images';
    } else if (
      mediaType &&
      (mediaType.startsWith('font/') ||
        mediaType.includes('font') ||
        mediaType.includes('opentype'))
    ) {
      targetSubDir = 'Fonts';
    } else if (itemHref.endsWith('.ncx') || itemHref.endsWith('.opf')) {
      const targetDirForMeta = path.join(targetBookOutputDir, 'OEBPS');
      const targetPathForMeta = path.join(targetDirForMeta, path.basename(itemHref));
      try {
        console.log(
          `[copyFilesToStandardizedLocations] Copying metadata file from ${sourcePath} to ${targetPathForMeta}`,
        );
        await fs.mkdir(targetDirForMeta, { recursive: true });
        await fs.copyFile(sourcePath, targetPathForMeta);
      } catch (error) {
        console.error(
          `[copyFilesToStandardizedLocations] Failed to copy metadata ${sourcePath} to ${targetPathForMeta}:`,
          error,
        );
      }
      continue;
    } else {
      console.warn(
        `[copyFilesToStandardizedLocations] Unhandled media type '${mediaType}' or file type for manifest item id '${item.id}', href '${itemHref}'. Skipping copy to standard location.`,
      );
      continue;
    }

    const targetDir = path.join(targetBookOutputDir, 'OEBPS', targetSubDir);
    const targetFilePath = path.join(targetDir, path.basename(itemHref));

    try {
      console.log(
        `[copyFilesToStandardizedLocations] Attempting to copy: ${sourcePath} ==> ${targetFilePath}`,
      );
      await fs.mkdir(targetDir, { recursive: true });
      await fs.copyFile(sourcePath, targetFilePath);
      console.log(`[copyFilesToStandardizedLocations] Successfully copied to: ${targetFilePath}`);
    } catch (error) {
      console.error(
        `[copyFilesToStandardizedLocations] Failed to copy ${sourcePath} to ${targetFilePath}:`,
        error,
      );
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        console.warn(
          `[copyFilesToStandardizedLocations] Source file not found: ${sourcePath} (href: ${itemHref}). This EPUB might be malformed or href is incorrect.`,
        );
      }
    }
  }
}

async function preprocessEPUB(filePath: string) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'epub-'));
  const bookSpecificOutputDir = path.join(__dirname, 'output', path.basename(filePath, '.epub'));
  console.log(`[preprocessEPUB] Starting for filePath: ${filePath}`);
  console.log(`[preprocessEPUB] Target book-specific outputDir: ${bookSpecificOutputDir}`);

  try {
    const extractedDir = await extractEpub(filePath);
    console.log(`[preprocessEPUB] EPUB extracted to: ${extractedDir}`);

    const opfPath = await findContentOpf(extractedDir);
    console.log(`[preprocessEPUB] Found OPF at: ${opfPath}`);
    const opfContent = await fs.readFile(opfPath, 'utf-8');
    const { metadata, manifest, spine, coverHref, guide } = await parseOPF(opfContent);

    const manifestTimestamp = Date.now();
    const manifestFileName = `manifest-${manifestTimestamp}.json`;
    const manifestUrl = `${STATIC_BASE_URL}/epub/${path.basename(
      bookSpecificOutputDir,
    )}/${manifestFileName}`;
    const document = await epubService.createDocument(
      metadata.title || path.basename(filePath, '.epub'),
      metadata.creator || 'Unknown Author',
      manifestUrl,
    );

    await copyFilesToStandardizedLocations(extractedDir, bookSpecificOutputDir, manifest, opfPath);

    const chapterFilePathsForProcessing = spine
      .map((item) => {
        const manifestItem = manifest.find(
          (m) => m.id === item.idref && m['media-type'] === 'application/xhtml+xml',
        );
        if (manifestItem?.href) {
          return path.join(
            bookSpecificOutputDir,
            'OEBPS',
            'Text',
            path.basename(manifestItem.href),
          );
        }
        return null;
      })
      .filter((file): file is string => file !== null);

    console.log(
      `[preprocessEPUB] Chapter file paths for processing: ${chapterFilePathsForProcessing.join(
        '\n',
      )}`,
    );
    const chapterPrefix = path.basename(bookSpecificOutputDir).replace(/[^a-zA-Z0-9]/g, '_');
    for (const chapFile of chapterFilePathsForProcessing) {
      console.log(`[preprocessEPUB] About to process chapter file: ${chapFile}`);
      await processChapter(chapFile, chapterPrefix);
    }
    await epubService.updateDocumentChapters(document.id, chapterFilePathsForProcessing.length);

    const cssFiles = await findStylesFiles(bookSpecificOutputDir);

    const epubManifest = {
      id: document.id,
      title: document.title,
      author: document.author,
      epubPath: manifestUrl,
      chapters: spine
        .map((item) => {
          const manifestItem = manifest.find(
            (m) => m.id === item.idref && m['media-type'] === 'application/xhtml+xml',
          );
          return manifestItem?.href
            ? `${STATIC_BASE_URL}/epub/${path.basename(
                bookSpecificOutputDir,
              )}/OEBPS/Text/${path.basename(manifestItem.href)}`
            : null;
        })
        .filter((url): url is string => url !== null),
      css: cssFiles.map(
        (file) =>
          `${STATIC_BASE_URL}/epub/${path.basename(
            bookSpecificOutputDir,
          )}/OEBPS/Styles/${path.basename(file)}`,
      ),
      cover: coverHref
        ? `${STATIC_BASE_URL}/epub/${path.basename(bookSpecificOutputDir)}/OEBPS/${coverHref}`
        : `${STATIC_BASE_URL}/epub/${path.basename(bookSpecificOutputDir)}/OEBPS/images/cover.jpeg`,
      guide: guide?.map((g) => {
        const guideItemBasename = g.href ? path.basename(g.href) : '';
        return {
          ...g,
          href: g.href
            ? `${STATIC_BASE_URL}/epub/${path.basename(
                bookSpecificOutputDir,
              )}/OEBPS/Text/${guideItemBasename}`
            : '',
        };
      }),
      createdAt: new Date().toISOString(),
    };

    const finalManifestPath = path.join(bookSpecificOutputDir, manifestFileName);
    await fs.writeFile(finalManifestPath, JSON.stringify(epubManifest, null, 2));
    console.log(`[preprocessEPUB] Manifest written to ${finalManifestPath}`);

    return {
      manifestPath: finalManifestPath,
      epubDir: bookSpecificOutputDir,
      opfPath,
    };
  } catch (error) {
    console.error(`[preprocessEPUB] Error processing EPUB ${filePath}:`, error);
    throw error;
  } finally {
    // await fs.rm(tempDir, { recursive: true, force: true });
  }
}

async function main() {
  if (process.argv.length < 3) {
    console.error('Usage: ts-node preprocess-epub.ts <epub-file>');
    process.exit(1);
  }
  const epubPath = process.argv[2];
  try {
    const result = await preprocessEPUB(epubPath);
    console.log('Successfully processed EPUB. Output directory:', result.epubDir);
    console.log('Manifest path:', result.manifestPath);
    console.log('OPF path:', result.opfPath);
  } catch (error) {
    console.error('Error in main:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
