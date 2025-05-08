import React, { useState, useEffect } from 'react';
import { usePageImage, usePageOCR } from '../lib/queries';
import { TextSelection } from './TextSelection';
import { OCRBox } from '../lib/api';

interface PageRendererProps {
  documentId: number;
  pageNumber: number;
  width: number;
  height: number;
  dpi?: 144 | 288;
  onTextSelected?: (text: string) => void;
  onLoad?: (dimensions: { width: number; height: number }) => void;
}

export const PageRenderer: React.FC<PageRendererProps> = ({
  documentId,
  pageNumber,
  width,
  height,
  dpi = 144,
  onTextSelected,
  onLoad,
}) => {
  const [scale, setScale] = useState(1);
  const [naturalDimensions, setNaturalDimensions] = useState({ width: 0, height: 0 });
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Fetch image and OCR data
  const { data: imageUrl, isLoading: isImageLoading } = usePageImage(documentId, pageNumber, dpi);
  const { data: ocrData, isLoading: isOcrLoading } = usePageOCR(documentId, pageNumber);

  // Handle image load to get natural dimensions
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    setNaturalDimensions({ width: imgWidth, height: imgHeight });
    setIsImageLoaded(true);

    if (onLoad) {
      onLoad({ width: imgWidth, height: imgHeight });
    }
  };

  // Calculate scale when dimensions change
  useEffect(() => {
    if (naturalDimensions.width && naturalDimensions.height) {
      // Calculate scale to fit container while maintaining aspect ratio
      const scaleX = width / naturalDimensions.width;
      const scaleY = height / naturalDimensions.height;
      const newScale = Math.min(scaleX, scaleY);

      setScale(newScale);
    }
  }, [width, height, naturalDimensions]);

  const isLoading = isImageLoading || isOcrLoading;
  const hasData = imageUrl && ocrData;

  if (isLoading && !hasData) {
    return (
      <div
        style={{ width, height, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <div>Loading page {pageNumber}...</div>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div
        style={{ width, height, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <div>Failed to load page {pageNumber}</div>
      </div>
    );
  }

  const scaledWidth = naturalDimensions.width * scale;
  const scaledHeight = naturalDimensions.height * scale;

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <img
        src={imageUrl}
        alt={`Page ${pageNumber}`}
        onLoad={handleImageLoad}
        style={{
          width: `${scaledWidth}px`,
          height: `${scaledHeight}px`,
          objectFit: 'contain',
        }}
      />

      {isImageLoaded && ocrData && (
        <TextSelection
          ocrData={ocrData.ocr_data as OCRBox[]}
          width={scaledWidth}
          height={scaledHeight}
          scale={scale}
          onTextSelected={onTextSelected}
        />
      )}
    </div>
  );
};
