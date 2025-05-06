import { exec } from 'child_process';
import { promisify } from 'util';
import sharp from 'sharp';
import cliProgress from 'cli-progress';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory name of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));

const execAsync = promisify(exec);

async function convertPDF(inputFile, outputDir = '/output') {
  try {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Fetch page count
    const { stdout } = await execAsync(`pdfinfo "${inputFile}"`);
    const pageCount = parseInt(stdout.match(/Pages:\s+(\d+)/)[1], 10);
    console.log(`PDF has ${pageCount} pages`);

    // Initialize progress bar
    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    progressBar.start(pageCount, 0);

    for (let n = 1; n <= pageCount; n++) {
      // Format page number with leading zeros (e.g., 0001, 0002)
      const pageNum = n.toString().padStart(4, '0');
      const stem = path.join(outputDir, pageNum);

      try {
        console.log(`\n==== Processing page ${n}/${pageCount} ====`);

        // Rasterize to PNG at 144 dpi
        console.log(`Converting page ${n} at 144 dpi...`);
        const cmd144 = `pdftoppm -png -f ${n} -l ${n} -r 144 "${inputFile}" "${stem}_144"`;
        console.log(`Executing: ${cmd144}`);
        await execAsync(cmd144);

        // Rasterize to PNG at 288 dpi
        console.log(`Converting page ${n} at 288 dpi...`);
        const cmd288 = `pdftoppm -png -f ${n} -l ${n} -r 288 "${inputFile}" "${stem}_288"`;
        console.log(`Executing: ${cmd288}`);
        await execAsync(cmd288);

        // List all files in output directory to help with debugging
        console.log('Files in output directory:');
        const files = await fs.promises.readdir(outputDir);
        console.log(files);

        // Find the actual output files from pdftoppm - they often have "-1" appended
        const png144Pattern = `${pageNum}_144-`;
        const png288Pattern = `${pageNum}_288-`;

        const png144 = files.find((f) => f.startsWith(png144Pattern) && f.endsWith('.png'));
        const png288 = files.find((f) => f.startsWith(png288Pattern) && f.endsWith('.png'));

        console.log(`Looking for patterns: ${png144Pattern}*, ${png288Pattern}*`);
        console.log(`Found files: ${png144}, ${png288}`);

        if (!png144 || !png288) {
          throw new Error(`PDF conversion failed. Output files not found for page ${pageNum}`);
        }

        // Convert PNG to WebP
        console.log('Converting to WebP...');
        await sharp(path.join(outputDir, png144))
          .webp({ quality: 90, method: 6 })
          .toFile(`${stem}@144.webp`);
        await sharp(path.join(outputDir, png288))
          .webp({ quality: 90, method: 6 })
          .toFile(`${stem}@288.webp`);

        // Delete PNG files
        fs.unlinkSync(path.join(outputDir, png144));
        fs.unlinkSync(path.join(outputDir, png288));

        // Use native tesseract command line tool for OCR
        console.log('Performing OCR (using native Tesseract via CLI)...');
        try {
          // Use the native tesseract command line tool instead of tesseract.js
          const ocrCmd = `tesseract ${stem}@144.webp ${stem} -l eng tsv`;
          await execAsync(ocrCmd);

          // Process the TSV file to create our JSON format
          if (fs.existsSync(`${stem}.tsv`)) {
            const tsvContent = fs.readFileSync(`${stem}.tsv`, 'utf-8');
            const lines = tsvContent.split('\n').slice(1); // Skip header

            // Extract word data from TSV
            const words = [];
            for (const line of lines) {
              const parts = line.split('\t');
              if (parts.length >= 12) {
                const [, , x1, y1, x2, y2, , , , , , text] = parts;

                if (text && text.trim()) {
                  // Get image dimensions for normalization
                  const { width, height } = await sharp(`${stem}@144.webp`).metadata();

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
            fs.writeFileSync(`${stem}.json`, JSON.stringify(words, null, 2));

            // Remove TSV file
            fs.unlinkSync(`${stem}.tsv`);
          }
        } catch (ocrError) {
          console.error('OCR error, creating empty JSON:', ocrError);
          fs.writeFileSync(`${stem}.json`, JSON.stringify([], null, 2));
        }

        console.log(`Page ${n} processing complete`);

        // Update progress bar
        progressBar.increment();
      } catch (error) {
        console.error(`Error processing page ${n}:`, error);
        throw error; // Re-throw to stop the process
      }
    }

    progressBar.stop();
    console.log('PDF processing complete!');
  } catch (error) {
    console.error('Error during conversion:', error);
    process.exit(1);
  }
}

// Parse command-line arguments
const args = process.argv.slice(2);
// Default to /input/1984.pdf if no input file is specified
const inputFile = args[0] || '/input/1984.pdf';
const outputDir = args.includes('--out') ? args[args.indexOf('--out') + 1] : '/output';

console.log(`Processing file: ${inputFile}`);
console.log(`Output directory: ${outputDir}`);

convertPDF(inputFile, outputDir);
