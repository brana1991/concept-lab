import { RefObject } from 'react';

interface SelectionState {
  text: string;
  range: Range | null;
  position: { x: number; y: number } | null;
}

interface UseSelectionActionsProps {
  selectionState: SelectionState;
  iframeRef: RefObject<HTMLIFrameElement>;
  onSelectionClear: () => void;
}

export const useSelectionActions = ({
  selectionState,
  iframeRef,
  onSelectionClear,
}: UseSelectionActionsProps) => {
  const handleHighlight = () => {
    if (selectionState.range && iframeRef.current?.contentDocument) {
      try {
        const iframeDoc = iframeRef.current.contentDocument;
        const mark = iframeDoc.createElement('mark');
        mark.className = 'user-highlight';

        selectionState.range.surroundContents(mark);
      } catch (e) {
        console.error('Error highlighting selection', e);
      }

      onSelectionClear();
    }
  };

  const handleCopy = () => {
    if (selectionState.text) {
      navigator.clipboard
        .writeText(selectionState.text)
        .then(() => console.log('Text copied to clipboard'))
        .catch((e) => console.error('Error copying to clipboard', e));

      onSelectionClear();
    }
  };

  const handleAddNote = () => {
    if (selectionState.text) {
      console.log('Add note:', { text: selectionState.text });
      onSelectionClear();
    }
  };

  const handleAskAI = () => {
    if (selectionState.text) {
      console.log('Ask LLM:', selectionState.text);
      onSelectionClear();
    }
  };

  return {
    handleHighlight,
    handleCopy,
    handleAddNote,
    handleAskAI,
  };
};
