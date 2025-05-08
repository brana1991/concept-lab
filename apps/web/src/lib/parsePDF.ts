import * as pdfjs from 'pdfjs-dist';

// Set worker path
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.mjs`;

interface PDFPage {
  dataUrl: string;
  width: number;
  height: number;
}

export const parsePDF = async (file: File): Promise<PDFPage[]> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;
  const pages: PDFPage[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      throw new Error('Could not get canvas context');
    }

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport }).promise;
    
    pages.push({
      dataUrl: canvas.toDataURL('image/png'),
      width: viewport.width,
      height: viewport.height
    });
  }

  return pages;
};
