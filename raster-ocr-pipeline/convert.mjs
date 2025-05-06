import { exec } from 'child_process';
import { promisify } from 'util';
import sharp from 'sharp';
import tesseract from 'tesseract.js';
import cliProgress from 'cli-progress';
import fs from 'fs';
import path from 'path';

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

    // Initialize progress bar
    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    progressBar.start(pageCount, 0);

    for (let n = 1; n <= pageCount; n++) {
      // Format page number with leading zeros (e.g., 0001, 0002)
      const pageNum = n.toString().padStart(4, '0');
      const stem = path.join(outputDir, pageNum);

      try {
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

        // Find the actual output files from pdftoppm
        const files = await fs.promises.readdir(outputDir);
        const png144 = files.find((f) => f.startsWith(`${pageNum}_144`) && f.endsWith('.png'));
        const png288 = files.find((f) => f.startsWith(`${pageNum}_288`) && f.endsWith('.png'));

        if (!png144 || !png288) {
          throw new Error(`PDF conversion failed. Output files not found for page ${pageNum}`);
        }

        console.log(`Found files: ${png144}, ${png288}`);

        // Convert PNG to WebP
        await sharp(path.join(outputDir, png144))
          .webp({ quality: 90, method: 6 })
          .toFile(`${stem}@144.webp`);
        await sharp(path.join(outputDir, png288))
          .webp({ quality: 90, method: 6 })
          .toFile(`${stem}@288.webp`);

        // Delete PNG files
        fs.unlinkSync(path.join(outputDir, png144));
        fs.unlinkSync(path.join(outputDir, png288));

        // Perform OCR on 144 dpi WebP
        const {
          data: { text, words },
        } = await tesseract.recognize(`${stem}@144.webp`, 'eng');
        const ocrData = words.map((word) => ({
          text: word.text,
          bbox: [
            word.bbox.x0 / word.bbox.width,
            word.bbox.y0 / word.bbox.height,
            word.bbox.width / word.bbox.width,
            word.bbox.height / word.bbox.height,
          ],
        }));

        // Save OCR data to JSON
        fs.writeFileSync(`${stem}.json`, JSON.stringify(ocrData, null, 2));

        // Update progress bar
        progressBar.increment();
      } catch (error) {
        console.error(`Error processing page ${n}:`, error);
        throw error; // Re-throw to stop the process
      }
    }

    progressBar.stop();
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
