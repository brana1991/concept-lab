import { RefObject, useState, useCallback } from 'react';

interface SelectionState {
  text: string;
  range: Range | null;
  position: { x: number; y: number } | null;
}

interface UseSelectionProps {
  iframeRef: RefObject<HTMLIFrameElement>;
}

export const useSelection = ({ iframeRef }: UseSelectionProps) => {
  const [selectionState, setSelectionState] = useState<SelectionState>({
    text: '',
    range: null,
    position: null,
  });

  // Helper to get sentence containing the range
  const getSentenceContainingRange = (range: Range): Range => {
    try {
      const container = range.commonAncestorContainer;
      const textContent = container.textContent || '';
      const sentences = textContent.split(/[.!?]+\s+/);
      const selectedText = range.toString().trim();
      const sentence = sentences.find((s) => s.includes(selectedText)) || selectedText;

      // Create a new range for the entire sentence
      const sentenceRange = range.cloneRange();
      const startOffset = textContent.indexOf(sentence);
      const endOffset = startOffset + sentence.length;

      sentenceRange.setStart(container, startOffset);
      sentenceRange.setEnd(container, endOffset);

      return sentenceRange;
    } catch (e) {
      console.error('Error getting sentence range:', e);
      return range;
    }
  };

  const clearSelection = () => {
    // Reset selection by directly calling the appropriate methods
    const selection = window.getSelection();
    if (selection) selection.removeAllRanges();

    // Clear any iframe selection if it exists
    if (iframeRef.current?.contentDocument) {
      iframeRef.current.contentDocument.getSelection()?.removeAllRanges();
    }

    // Clear selection state
    setSelectionState({ text: '', range: null, position: null });
  };

  const handleSelection = useCallback(() => {
    const iframe = iframeRef.current;
    const iframeDoc = iframe?.contentDocument;
    if (!iframe || !iframeDoc) return;

    // Short delay to allow selection to complete
    setTimeout(() => {
      const selection = iframeDoc.getSelection();
      if (!selection || selection.isCollapsed) return;

      const text = selection.toString().trim();
      if (text.length === 0) return;

      try {
        // Get the range and position
        const range = selection.getRangeAt(0);
        const sentenceRange = getSentenceContainingRange(range);

        // Calculate position for the menu
        const rect = range.getBoundingClientRect();
        const iframeRect = iframe.getBoundingClientRect();

        // Calculate position for the menu
        const menuX = rect.left + iframeRect.left;
        const menuY = rect.bottom + iframeRect.top + 10;

        // Set up the selection state for the menu
        setSelectionState({
          text,
          range: sentenceRange, // Store the sentence range instead of the selection range
          position: {
            x: menuX,
            y: menuY,
          },
        });
      } catch (e) {
        console.error('Error handling selection', e);
      }
    }, 100);
  }, [iframeRef]);

  return {
    selectionState,
    handleSelection,
    clearSelection,
  };
};
