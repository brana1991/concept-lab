import { RefObject, useState, useRef, useCallback } from 'react';

interface SelectionState {
  text: string;
  range: Range | null;
  position: { x: number; y: number } | null;
}

interface UseSelectionProps {
  iframeRef: RefObject<HTMLIFrameElement>;
}

export const useSelection = ({ iframeRef }: UseSelectionProps) => {
  const ghostRef = useRef<HTMLElement | null>(null);
  const [selectionState, setSelectionState] = useState<SelectionState>({
    text: '',
    range: null,
    position: null,
  });

  // Helper to get sentence containing the range
  const getSentenceContainingRange = (range: Range): string => {
    try {
      const text = range.toString().trim();
      const container = range.commonAncestorContainer;
      const textContent = container.textContent || '';

      // Simple sentence splitting - can be improved
      const sentences = textContent.split(/[.!?]+\s+/);
      const sentence = sentences.find((s) => s.includes(text)) || text;

      return sentence.trim();
    } catch (e) {
      console.error('Error getting sentence:', e);
      return range.toString().trim();
    }
  };

  // Helper to remove ghost highlight
  const removeGhostHighlight = () => {
    if (ghostRef.current) {
      try {
        ghostRef.current.classList.remove('ghost-sentence');
        ghostRef.current.remove();
        ghostRef.current = null;
      } catch (e) {
        console.error('Error removing ghost highlight', e);
      }
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

    // Remove ghost highlight
    removeGhostHighlight();

    // Clear selection state
    setSelectionState({ text: '', range: null, position: null });
  };

  const handleSelection = useCallback(() => {
    const iframe = iframeRef.current;
    const iframeDoc = iframe?.contentDocument;
    if (!iframe || !iframeDoc) return;

    // Clear any previous ghost highlight
    removeGhostHighlight();

    // Short delay to allow selection to complete
    setTimeout(() => {
      const selection = iframeDoc.getSelection();
      if (!selection || selection.isCollapsed) return;

      const text = selection.toString().trim();
      if (text.length === 0) return;

      try {
        // Get the range and position
        const range = selection.getRangeAt(0);

        // Create ghost sentence highlight
        const sentence = getSentenceContainingRange(range);
        const sentenceElement = iframeDoc.createElement('span');
        sentenceElement.textContent = sentence;
        sentenceElement.classList.add('ghost-sentence');
        ghostRef.current = sentenceElement;

        // Insert ghost highlight without disrupting selection
        const tempRange = iframeDoc.createRange();
        tempRange.selectNode(range.commonAncestorContainer);
        try {
          tempRange.insertNode(sentenceElement);
        } catch (e) {
          console.error('Error inserting ghost highlight', e);
        }

        // Calculate position for the menu
        const rect = range.getBoundingClientRect();
        const iframeRect = iframe.getBoundingClientRect();

        // Calculate position for the menu
        const menuX = rect.left + iframeRect.left;
        const menuY = rect.bottom + iframeRect.top + 10;

        // Set up the selection state for the menu
        setSelectionState({
          text,
          range,
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
