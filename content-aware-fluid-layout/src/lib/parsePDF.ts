import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

// Use the version of pdfjs-dist you have installed
const pdfjsVersion = '5.2.133'; // Update this to match the installed version
GlobalWorkerOptions.workerSrc = `/pdf.worker.mjs`;

export const parsePDF = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;
  const pages = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport }).promise;
    pages.push(canvas.toDataURL('image/png'));
  }

  return pages;
};
