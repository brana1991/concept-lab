import React, { useState, useRef, useEffect } from 'react';
import { PageRenderer } from './PageRenderer';
import { useDocument, usePrefetchPages } from '../lib/queries';

interface PDFViewerProps {
  documentId: number;
  initialPage?: number;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ documentId, initialPage = 1 }) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [selectedText, setSelectedText] = useState('');
  const [displayMode, setDisplayMode] = useState<'single' | 'double'>('double');
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch document metadata
  const { data: document, isLoading: isDocumentLoading } = useDocument(documentId);

  // Prefetch adjacent pages for smoother navigation
  usePrefetchPages(documentId, currentPage, 2);

  // Update container size on resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  // Calculate page dimensions based on container size and display mode
  const getPageDimensions = () => {
    const maxWidth =
      displayMode === 'single' ? containerSize.width - 40 : (containerSize.width - 60) / 2;

    const maxHeight = containerSize.height - 80;

    return { width: maxWidth, height: maxHeight };
  };

  const pageDimensions = getPageDimensions();

  // Navigation handlers
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => {
        // In double page mode, go back by 2 unless at second page
        return displayMode === 'double' && prev > 2 ? prev - 2 : prev - 1;
      });
    }
  };

  const goToNextPage = () => {
    if (document && currentPage < document.total_pages) {
      setCurrentPage((prev) => {
        // In double page mode, go forward by 2 unless it would exceed total pages
        if (displayMode === 'double') {
          return Math.min(prev + 2, document.total_pages);
        }
        return prev + 1;
      });
    }
  };

  // Handle text selection
  const handleTextSelected = (text: string) => {
    setSelectedText(text);
  };

  // Toggle display mode
  const toggleDisplayMode = () => {
    setDisplayMode((prev) => (prev === 'single' ? 'double' : 'single'));
  };

  if (isDocumentLoading || !document) {
    return <div>Loading document...</div>;
  }

  return (
    <div className="pdf-viewer">
      <div className="pdf-viewer-controls">
        <button onClick={goToPreviousPage} disabled={currentPage <= 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {document.total_pages}
        </span>
        <button onClick={goToNextPage} disabled={currentPage >= document.total_pages}>
          Next
        </button>
        <button onClick={toggleDisplayMode}>
          {displayMode === 'single' ? 'Double Page' : 'Single Page'}
        </button>
      </div>

      {selectedText && (
        <div className="selected-text-container">
          <div className="selected-text">{selectedText}</div>
          <button
            className="copy-button"
            onClick={() => {
              navigator.clipboard.writeText(selectedText);
              alert('Text copied to clipboard!');
            }}
          >
            Copy
          </button>
          <button className="close-button" onClick={() => setSelectedText('')}>
            ✕
          </button>
        </div>
      )}

      <div
        ref={containerRef}
        className="pdf-viewer-pages"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 150px)',
          gap: '20px',
        }}
      >
        <PageRenderer
          documentId={documentId}
          pageNumber={currentPage}
          width={pageDimensions.width}
          height={pageDimensions.height}
          onTextSelected={handleTextSelected}
        />

        {displayMode === 'double' && currentPage < document.total_pages && (
          <PageRenderer
            documentId={documentId}
            pageNumber={currentPage + 1}
            width={pageDimensions.width}
            height={pageDimensions.height}
            onTextSelected={handleTextSelected}
          />
        )}
      </div>
    </div>
  );
};
