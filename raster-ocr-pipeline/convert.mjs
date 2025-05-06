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
      // Rasterize to PNG at 144 and 288 dpi
      const stem = path.join(outputDir, `000${n.toString().padStart(2, '0')}`);
      await execAsync(`pdftoppm -png -f ${n} -l ${n} -r 144 "${inputFile}" "${stem}@144"`);
      await execAsync(`pdftoppm -png -f ${n} -l ${n} -r 288 "${inputFile}" "${stem}@288"`);

      console.log('here');

      // Convert PNG to WebP
      await sharp(`${stem}@144-1.png`).webp({ quality: 90, method: 6 }).toFile(`${stem}@144.webp`);
      await sharp(`${stem}@288-1.png`).webp({ quality: 90, method: 6 }).toFile(`${stem}@288.webp`);

      // Delete PNG files
      fs.unlinkSync(`${stem}@144-1.png`);
      fs.unlinkSync(`${stem}@288-1.png`);

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
    }

    progressBar.stop();
  } catch (error) {
    console.error('Error during conversion:', error);
    process.exit(1);
  }
}

// Parse command-line arguments
const args = process.argv.slice(2);
const inputFile = args[0];
const outputDir = args.includes('--out') ? args[args.indexOf('--out') + 1] : '/output';

convertPDF(inputFile, outputDir);
