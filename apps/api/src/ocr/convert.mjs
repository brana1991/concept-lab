import { exec } from 'child_process';
import { promisify } from 'util';
import sharp from 'sharp';
import cliProgress from 'cli-progress';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pg from 'pg';

// Get the directory name of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));

const execAsync = promisify(exec);

// Database connection
const { Pool } = pg;
const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'flipbook',
  port: process.env.PGPORT || 5432,
});

async function convertPDF(inputFile, outputDir = '/output', saveToDb = true) {
  let client;
  let documentId;

  try {
    // Ensure the input file exists
    if (!fs.existsSync(inputFile)) {
      throw new Error(`Input file not found: ${inputFile}`);
    }

    console.log(`Checking input file: ${inputFile}`);
    console.log(`File exists: ${fs.existsSync(inputFile)}`);

    // Ensure output directory exists and is writable
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Check if the output directory is writable
    try {
      fs.accessSync(outputDir, fs.constants.W_OK);
      console.log(`Output directory ${outputDir} is writable`);
    } catch (err) {
      console.error(`Output directory ${outputDir} is not writable!`);
      throw err;
    }

    // Fetch page count
    const { stdout } = await execAsync(`pdfinfo "${inputFile}"`);
    const pageCount = parseInt(stdout.match(/Pages:\s+(\d+)/)[1], 10);
    console.log(`PDF has ${pageCount} pages`);

    // Get filename from path
    const filename = path.basename(inputFile);

    // Connect to database if saving to DB
    if (saveToDb) {
      try {
        client = await pool.connect();

        // Insert document
        const docResult = await client.query(
          'INSERT INTO documents (filename, total_pages) VALUES ($1, $2) RETURNING id',
          [filename, pageCount],
        );
        documentId = docResult.rows[0].id;
        console.log(`Created document record with ID: ${documentId}`);
      } catch (dbError) {
        console.error('Database connection error:', dbError);
        console.log('Continuing without database storage...');
        saveToDb = false;
      }
    }

    // Initialize progress bar
    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    progressBar.start(pageCount, 0);

    for (let n = 1; n <= pageCount; n++) {
      // Format page number with leading zeros (e.g., 0001, 0002)
      const pageNum = n.toString().padStart(4, '0');
      const outputBase = path.join(outputDir, pageNum);

      try {
        console.log(`\n==== Processing page ${n}/${pageCount} ====`);

        // Ensure temporary directory exists
        const tmpDir = path.join(outputDir, 'tmp');
        if (!fs.existsSync(tmpDir)) {
          fs.mkdirSync(tmpDir, { recursive: true });
        }

        // Use temporary directory for initial conversion to avoid path issues
        const tmpBase = path.join(tmpDir, `page_${n}`);

        // Rasterize to PNG at 144 dpi
        console.log(`Converting page ${n} at 144 dpi...`);
        const cmd144 = `pdftoppm -png -f ${n} -l ${n} -r 144 "${inputFile}" "${tmpBase}_144"`;
        console.log(`Executing: ${cmd144}`);
        const result144 = await execAsync(cmd144);
        if (result144.stderr) console.log('Stderr:', result144.stderr);

        // Rasterize to PNG at 288 dpi
        console.log(`Converting page ${n} at 288 dpi...`);
        const cmd288 = `pdftoppm -png -f ${n} -l ${n} -r 288 "${inputFile}" "${tmpBase}_288"`;
        console.log(`Executing: ${cmd288}`);
        const result288 = await execAsync(cmd288);
        if (result288.stderr) console.log('Stderr:', result288.stderr);

        // List all files in tmp directory to debug
        console.log('Files in tmp directory:');
        const tmpFiles = await fs.promises.readdir(tmpDir);
        console.log(tmpFiles);

        // Find the actual output files from pdftoppm
        const png144File = tmpFiles.find(
          (f) => f.startsWith(`page_${n}_144`) && f.endsWith('.png'),
        );
        const png288File = tmpFiles.find(
          (f) => f.startsWith(`page_${n}_288`) && f.endsWith('.png'),
        );

        if (!png144File || !png288File) {
          throw new Error(`PDF conversion failed. Output files not found for page ${n}`);
        }

        const png144Path = path.join(tmpDir, png144File);
        const png288Path = path.join(tmpDir, png288File);

        console.log(`Found PNG files: ${png144Path}, ${png288Path}`);

        // Check that files exist
        if (!fs.existsSync(png144Path)) {
          throw new Error(`144 dpi PNG file not found: ${png144Path}`);
        }
        if (!fs.existsSync(png288Path)) {
          throw new Error(`288 dpi PNG file not found: ${png288Path}`);
        }

        // Prepare WebP paths
        const webpLowRes = `${outputBase}@144.webp`;
        const webpHighRes = `${outputBase}@288.webp`;

        // Convert PNG to WebP
        console.log('Converting to WebP...');
        await sharp(png144Path).webp({ quality: 90, method: 6 }).toFile(webpLowRes);
        await sharp(png288Path).webp({ quality: 90, method: 6 }).toFile(webpHighRes);

        // Delete temporary PNG files
        fs.unlinkSync(png144Path);
        fs.unlinkSync(png288Path);

        // Use native tesseract command line tool for OCR
        console.log('Performing OCR (using native Tesseract via CLI)...');
        let words = [];
        try {
          // Use the native tesseract command line tool instead
          const jsonPath = `${outputBase}.json`;
          const tsvPath = `${outputBase}.tsv`;

          // Run tesseract
          const ocrCmd = `tesseract ${webpLowRes} ${outputBase} -l eng tsv`;
          await execAsync(ocrCmd);

          // Process the TSV file to create our JSON format
          if (fs.existsSync(tsvPath)) {
            const tsvContent = fs.readFileSync(tsvPath, 'utf-8');
            const lines = tsvContent.split('\n').slice(1); // Skip header

            // Extract word data from TSV
            for (const line of lines) {
              const parts = line.split('\t');
              if (parts.length >= 12) {
                const [, , x1, y1, x2, y2, , , , , , text] = parts;

                if (text && text.trim()) {
                  // Get image dimensions for normalization
                  const { width, height } = await sharp(webpLowRes).metadata();

                  // Calculate normalized bbox
                  const x = parseFloat(x1) / width;
                  const y = parseFloat(y1) / height;
                  const w = (parseFloat(x2) - parseFloat(x1)) / width;
                  const h = (parseFloat(y2) - parseFloat(y1)) / height;

                  words.push({
                    text: text.trim(),
                    bbox: [x, y, w, h],
                  });
                }
              }
            }

            // Save as JSON
            fs.writeFileSync(jsonPath, JSON.stringify(words, null, 2));

            // Remove TSV file
            fs.unlinkSync(tsvPath);
          }
        } catch (ocrError) {
          console.error('OCR error, creating empty JSON:', ocrError);
          fs.writeFileSync(`${outputBase}.json`, JSON.stringify(words, null, 2));
        }

        // Save to database if enabled
        if (saveToDb && client && documentId) {
          console.log(`Saving page ${n} to database...`);

          try {
            // Read the WebP files as binary data
            const lowResImage = fs.readFileSync(webpLowRes);
            const highResImage = fs.readFileSync(webpHighRes);
            const ocrData = JSON.stringify(words);

            // Insert page data
            await client.query(
              `INSERT INTO pages 
               (document_id, page_number, image_low_res, image_high_res, ocr_data) 
               VALUES ($1, $2, $3, $4, $5)`,
              [documentId, n, lowResImage, highResImage, ocrData],
            );
            console.log(`Saved page ${n} to database`);
          } catch (dbError) {
            console.error(`Error saving page ${n} to database:`, dbError);
            console.log('Continuing with file storage only...');
          }
        }

        console.log(`Page ${n} processing complete`);

        // Update progress bar
        progressBar.increment();
      } catch (error) {
        console.error(`Error processing page ${n}:`, error);
        throw error; // Re-throw to stop the process
      }
    }

    // Clean up temporary directory
    const tmpDir = path.join(outputDir, 'tmp');
    if (fs.existsSync(tmpDir)) {
      try {
        // List all files in tmp directory
        const tmpFiles = await fs.promises.readdir(tmpDir);

        // Delete each file
        for (const file of tmpFiles) {
          fs.unlinkSync(path.join(tmpDir, file));
        }

        // Remove the directory
        fs.rmdirSync(tmpDir);
      } catch (err) {
        console.error('Error cleaning up temporary directory:', err);
      }
    }

    progressBar.stop();
    console.log('PDF processing complete!');

    if (saveToDb && documentId) {
      console.log(`Document ID: ${documentId} - use this to retrieve pages from the database`);
    }
  } catch (error) {
    console.error('Error during conversion:', error);
    process.exit(1);
  } finally {
    // Release the database client
    if (client) {
      client.release();
    }
  }
}

// Parse command-line arguments
const args = process.argv.slice(2);
// Default to /input/1984.pdf if no input file is specified
const inputFile = args[0] || '/input/1984.pdf';
const outputDir = args.includes('--out') ? args[args.indexOf('--out') + 1] : '/output';
const skipDb = args.includes('--skip-db');

console.log(`Processing file: ${inputFile}`);
console.log(`Output directory: ${outputDir}`);
console.log(`Save to database: ${!skipDb}`);

convertPDF(inputFile, outputDir, !skipDb);
