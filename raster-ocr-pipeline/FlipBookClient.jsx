import React, { useState, useEffect } from 'react';
import './FlipBook.css';

const API_URL = 'http://localhost:3000/api';

const Paper = ({ documentId, pageNumber, isFlipped, onFlip, zIndex }) => {
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [ocrDataFront, setOcrDataFront] = useState([]);
  const [ocrDataBack, setOcrDataBack] = useState([]);

  useEffect(() => {
    // Fetch front page image (current page)
    const frontImageUrl = `${API_URL}/documents/${documentId}/pages/${pageNumber}/image-low`;
    setFrontImage(frontImageUrl);

    // Fetch back page image (next page)
    if (pageNumber < Infinity) {
      // Replace with actual total page count
      const backImageUrl = `${API_URL}/documents/${documentId}/pages/${pageNumber + 1}/image-low`;
      setBackImage(backImageUrl);
    }

    // Fetch OCR data for front page
    fetch(`${API_URL}/documents/${documentId}/pages/${pageNumber}/ocr`)
      .then((response) => response.json())
      .then((data) => setOcrDataFront(data))
      .catch((error) => console.error('Error fetching OCR data:', error));

    // Fetch OCR data for back page if not the last page
    if (pageNumber < Infinity) {
      // Replace with actual total page count
      fetch(`${API_URL}/documents/${documentId}/pages/${pageNumber + 1}/ocr`)
        .then((response) => response.json())
        .then((data) => setOcrDataBack(data))
        .catch((error) => console.error('Error fetching OCR data:', error));
    }
  }, [documentId, pageNumber]);

  return (
    <div
      className={`paper ${isFlipped ? 'flipped' : ''}`}
      style={{ zIndex }}
      onClick={() => onFlip(pageNumber)}
    >
      <div className="front">
        <div className="front-content">
          {frontImage && <img src={frontImage} alt={`Page ${pageNumber}`} />}
          {/* Optional: Overlay OCR data here */}
        </div>
      </div>
      <div className="back">
        <div className="back-content">
          {backImage && <img src={backImage} alt={`Page ${pageNumber + 1}`} />}
          {/* Optional: Overlay OCR data here */}
        </div>
      </div>
    </div>
  );
};

const FlipBook = ({ documentId }) => {
  const [document, setDocument] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [flippedPages, setFlippedPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pre-load buffer size
  const bufferSize = 2;

  useEffect(() => {
    // Fetch document metadata
    fetch(`${API_URL}/documents/${documentId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Document not found');
        }
        return response.json();
      })
      .then((data) => {
        setDocument(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [documentId]);

  const handleFlip = (pageNumber) => {
    setFlippedPages((prev) => {
      if (prev.includes(pageNumber)) {
        return prev.filter((p) => p !== pageNumber);
      } else {
        return [...prev, pageNumber];
      }
    });

    setCurrentPage(pageNumber);
  };

  if (loading) return <div className="loading">Loading document...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!document) return <div className="error">Document not found</div>;

  // Only render pages within the buffer around the current page
  const visiblePages = Array.from({ length: document.total_pages }, (_, i) => i + 1).filter(
    (page) => page >= currentPage - bufferSize && page <= currentPage + bufferSize,
  );

  return (
    <div className="flipbook-container">
      <div className="document-info">
        <h2>{document.title || document.filename}</h2>
        <p>
          Page {currentPage} of {document.total_pages}
        </p>
      </div>

      <div className="flipbook">
        {visiblePages.map((pageNumber) => {
          const isFlipped = flippedPages.includes(pageNumber);
          const zIndex = document.total_pages - pageNumber;

          return (
            <Paper
              key={pageNumber}
              documentId={documentId}
              pageNumber={pageNumber}
              isFlipped={isFlipped}
              onFlip={handleFlip}
              zIndex={zIndex}
            />
          );
        })}
      </div>

      <div className="controls">
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            if (currentPage > 1) {
              handleFlip(currentPage - 1);
            }
          }}
        >
          Previous
        </button>
        <button
          disabled={currentPage >= document.total_pages}
          onClick={() => {
            if (currentPage < document.total_pages) {
              handleFlip(currentPage + 1);
            }
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FlipBook;
