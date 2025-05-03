import React, { useEffect, useRef } from 'react';
import { getDocument, GlobalWorkerOptions, PDFDocumentProxy } from 'pdfjs-dist';
import { pdfjs } from 'pdfjs-dist/legacy/build/pdf';

interface PDFPageProps {
  pdf: PDFDocumentProxy;
  pageNumber: number;
  scale?: number;
}

// Set the worker path
GlobalWorkerOptions.workerSrc = `/pdf.worker.mjs`;

const PDFPage: React.FC<PDFPageProps> = ({ pdf, pageNumber, scale = 1.5 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textLayerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    const renderPage = async () => {
      const page = await pdf.getPage(pageNumber);
      const calculatedScale = scale * (window.devicePixelRatio || 1);
      const viewport = page.getViewport({ scale: calculatedScale });

      // Render canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext('2d');
        if (context) {
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.width = `${viewport.width / (window.devicePixelRatio || 1)}px`;
          canvas.style.height = `${viewport.height / (window.devicePixelRatio || 1)}px`;

          await page.render({ canvasContext: context, viewport }).promise;
        }
      }

      // Render text layer
      const textLayerDiv = textLayerRef.current;
      if (textLayerDiv) {
        const textContent = await page.getTextContent();
        (pdfjs as any).renderTextLayer({
          textContent,
          container: textLayerDiv,
          viewport,
          textDivs: [],
        });
        textLayerDiv.style.pointerEvents = 'none';
        textLayerDiv.style.color = 'transparent';
      }
    };

    renderPage();

    return () => {
      isMounted = false;
      if (textLayerRef.current) {
        textLayerRef.current.innerHTML = '';
      }
    };
  }, [pdf, pageNumber, scale]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} role="presentation" />
      <div ref={textLayerRef} style={{ position: 'absolute', inset: 0, userSelect: 'text' }} />
    </div>
  );
};

export default PDFPage;
