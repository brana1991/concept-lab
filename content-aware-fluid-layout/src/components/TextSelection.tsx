import React, { useState, useRef, useEffect } from 'react';
import { OCRBox } from '../lib/api';

interface TextSelectionProps {
  ocrData: OCRBox[];
  width: number;
  height: number;
  scale: number;
  onTextSelected?: (text: string) => void;
}

export const TextSelection: React.FC<TextSelectionProps> = ({
  ocrData,
  width,
  height,
  scale,
  onTextSelected,
}) => {
  const [selectedBoxes, setSelectedBoxes] = useState<OCRBox[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionRect, setSelectionRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });

  // Handle mouse down to start selection
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsSelecting(true);
    setStartPoint({ x, y });
    setSelectionRect({ x, y, width: 0, height: 0 });
    setSelectedBoxes([]);
  };

  // Handle mouse move to update selection rectangle
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSelecting || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const selRect = {
      x: Math.min(startPoint.x, x),
      y: Math.min(startPoint.y, y),
      width: Math.abs(x - startPoint.x),
      height: Math.abs(y - startPoint.y),
    };

    setSelectionRect(selRect);

    // Find intersecting OCR boxes
    const intersecting = ocrData.filter((box) => {
      const scaledBox = {
        x: box.bbox.x * scale,
        y: box.bbox.y * scale,
        width: box.bbox.width * scale,
        height: box.bbox.height * scale,
      };

      return (
        selRect.x < scaledBox.x + scaledBox.width &&
        selRect.x + selRect.width > scaledBox.x &&
        selRect.y < scaledBox.y + scaledBox.height &&
        selRect.y + selRect.height > scaledBox.y
      );
    });

    setSelectedBoxes(intersecting);
  };

  // Handle mouse up to finalize selection
  const handleMouseUp = () => {
    if (!isSelecting) return;

    setIsSelecting(false);

    if (selectedBoxes.length > 0 && onTextSelected) {
      // Sort boxes by Y position (top to bottom) with X position (left to right) as secondary sort
      const sortedBoxes = [...selectedBoxes].sort((a, b) => {
        const rowDiff = Math.abs(a.bbox.y - b.bbox.y);
        // If boxes are in the same row (within threshold)
        if (rowDiff < Math.max(a.bbox.height, b.bbox.height) * 0.5) {
          return a.bbox.x - b.bbox.x;
        }
        return a.bbox.y - b.bbox.y;
      });

      const selectedText = sortedBoxes.map((box) => box.text).join(' ');
      onTextSelected(selectedText);
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isSelecting) {
        handleMouseUp();
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isSelecting, selectedBoxes]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: `${width}px`,
        height: `${height}px`,
        pointerEvents: 'all',
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Render selection rectangle */}
      {isSelecting && (
        <div
          style={{
            position: 'absolute',
            left: `${selectionRect.x}px`,
            top: `${selectionRect.y}px`,
            width: `${selectionRect.width}px`,
            height: `${selectionRect.height}px`,
            backgroundColor: 'rgba(0, 100, 255, 0.2)',
            border: '1px solid rgba(0, 100, 255, 0.8)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Render highlighted OCR boxes */}
      {selectedBoxes.map((box, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: `${box.bbox.x * scale}px`,
            top: `${box.bbox.y * scale}px`,
            width: `${box.bbox.width * scale}px`,
            height: `${box.bbox.height * scale}px`,
            backgroundColor: 'rgba(0, 100, 255, 0.3)',
            pointerEvents: 'none',
          }}
        />
      ))}
    </div>
  );
};
