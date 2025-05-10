import React, { useEffect, useRef, useState } from 'react';
import { useEPUBManifest } from '../../lib/queries';
import { SelectionMenu } from '../SelectionMenu';
import '../../styles/selection.css';
import { IframeBuilder } from './IFrameBuilder';

// Debug logging
const DEBUG = true;
const logDebug = (message: string, data?: unknown) => {
  if (DEBUG) {
    console.log(`%c[EPUBReader] ${message}`, 'color: #2196f3; font-weight: bold', data || '');
  }
};

interface EPUBReaderProps {
  documentId: number;
  theme?: string;
}

const fetchChapterContent = async (chapterPath: string): Promise<string> => {
  const response = await fetch(chapterPath);

  if (!response.ok) {
    throw new Error(`Failed to load chapter: ${response.statusText}`);
  }

  const html = await response.text();

  return html;
};

export const EPUBReader: React.FC<EPUBReaderProps> = ({ documentId, theme = 'default' }) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const ghostRef = useRef<HTMLElement | null>(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [selectionState, setSelectionState] = useState<{
    text: string;
    range: Range | null;
    position: { x: number; y: number } | null;
  }>({
    text: '',
    range: null,
    position: null,
  });

  // Fetch EPUB document data
  const { data: document, isLoading } = useEPUBManifest(documentId);

  // Action handlers
  const handleHighlight = () => {
    logDebug('Highlighting selection', selectionState.text);

    if (selectionState.range && iframeRef.current?.contentDocument) {
      try {
        const iframeDoc = iframeRef.current.contentDocument;
        const mark = iframeDoc.createElement('mark');
        mark.className = 'user-highlight';

        selectionState.range.surroundContents(mark);
        logDebug('Added highlight mark');
      } catch (e) {
        logDebug('Error highlighting selection', e);
      }

      // Clear selection state
      setSelectionState({ text: '', range: null, position: null });
    }
  };

  const handleCopy = () => {
    logDebug('Copying selection', selectionState.text);

    if (selectionState.text) {
      navigator.clipboard
        .writeText(selectionState.text)
        .then(() => logDebug('Text copied to clipboard'))
        .catch((e) => logDebug('Error copying to clipboard', e));

      // Clear selection state
      setSelectionState({ text: '', range: null, position: null });
    }
  };

  const handleAddNote = () => {
    logDebug('Adding note for selection', selectionState.text);

    if (selectionState.text) {
      console.log('Add note:', { text: selectionState.text });

      // Clear selection state
      setSelectionState({ text: '', range: null, position: null });
    }
  };

  const handleAskAI = () => {
    logDebug('Asking AI about selection', selectionState.text);

    if (selectionState.text) {
      console.log('Ask LLM:', selectionState.text);

      // Clear selection state
      setSelectionState({ text: '', range: null, position: null });
    }
  };

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
        logDebug('Removed ghost highlight');
      } catch (e) {
        logDebug('Error removing ghost highlight', e);
      }
    }
  };

  useEffect(() => {
    if (!document || !iframeRef.current) return;

    const documentCss = document.css;
    const chapterPath = document?.chapters[currentChapter];
    const iframe: HTMLIFrameElement = iframeRef.current;

    const loadChapter = async () => {
      try {
        setError(null);

        const chapterHtml = await fetchChapterContent(chapterPath);
        const chapterDoc = new DOMParser().parseFromString(chapterHtml, 'application/xhtml+xml');

        new IframeBuilder(iframe)
          .copyHtmlToIframe(chapterDoc)
          .injectPublisherStyles(documentCss)
          .injectCustomStyles();

        // Add debugging events to iframe document
        if (iframe.contentDocument) {
          // Setup selection handling
          iframe.contentDocument.addEventListener('mouseup', () => {
            logDebug('Direct mouseup in iframe');

            // Clear any previous ghost highlight
            removeGhostHighlight();

            // Short delay to allow selection to complete
            setTimeout(() => {
              const selection = iframe.contentDocument?.getSelection();
              if (!selection || selection.isCollapsed) return;

              const text = selection.toString().trim();
              if (text.length === 0) return;

              logDebug('Selected text in iframe:', text);

              try {
                // Get the range and position
                const range = selection.getRangeAt(0);
                const iframeDoc = iframe.contentDocument!;

                // Create ghost sentence highlight
                const sentence = getSentenceContainingRange(range);
                logDebug('Found sentence:', sentence);

                const sentenceElement = iframeDoc.createElement('span');
                sentenceElement.textContent = sentence;
                sentenceElement.classList.add('ghost-sentence');
                ghostRef.current = sentenceElement;

                // Insert ghost highlight without disrupting selection
                const tempRange = iframeDoc.createRange();
                tempRange.selectNode(range.commonAncestorContainer);
                try {
                  tempRange.insertNode(sentenceElement);
                  logDebug('Inserted ghost highlight');
                } catch (e) {
                  logDebug('Error inserting ghost highlight', e);
                }

                // Calculate position for the menu
                const rect = range.getBoundingClientRect();
                const iframeRect = iframe.getBoundingClientRect();

                // Calculate position for the menu
                const menuX = rect.left + iframeRect.left;
                const menuY = rect.bottom + iframeRect.top + 10;

                logDebug('Menu position:', { x: menuX, y: menuY });

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
                logDebug('Error handling selection', e);
              }
            }, 100);
          });
        }
      } catch (error) {
        console.error('Error loading chapter:', error);
        setError(error instanceof Error ? error.message : 'Failed to load chapter');
      }
    };

    loadChapter();

    return () => {
      logDebug('Cleaning up EPUBReader');
    };
  }, [document, currentChapter, theme]);

  const goToNextChapter = () => {
    if (!document) return;
    const nextChapter = currentChapter + 1;
    if (nextChapter < document.chapters.length) {
      setCurrentChapter(nextChapter);
    }
  };

  const goToPreviousChapter = () => {
    const prevChapter = currentChapter - 1;
    if (prevChapter >= 0) {
      setCurrentChapter(prevChapter);
    }
  };

  if (isLoading) {
    return <div>Loading EPUB document...</div>;
  }

  if (!document) {
    return <div>Document not found</div>;
  }

  if (error) {
    return <div style={{ padding: '1rem', color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div
      className="epub-reader"
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <div
        style={{
          flex: 1,
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <iframe ref={iframeRef} style={{ width: '100%', height: '100%', border: 'none' }} />
      </div>
      <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={goToPreviousChapter} disabled={currentChapter === 0}>
          Previous Chapter
        </button>
        <span>
          {document.title} - Chapter {currentChapter + 1}
        </span>
        <button
          onClick={goToNextChapter}
          disabled={currentChapter === document.chapters.length - 1}
        >
          Next Chapter
        </button>
      </div>

      {selectionState.position && (
        <SelectionMenu
          position={selectionState.position}
          onHighlight={handleHighlight}
          onCopy={handleCopy}
          onNote={handleAddNote}
          onAsk={handleAskAI}
          onCancel={() => {
            logDebug('Selection menu cancel clicked');

            // Reset selection by directly calling the appropriate methods
            const selection = window.getSelection();
            if (selection) selection.removeAllRanges();

            // Clear any iframe selection if it exists
            const iframe = window.document.querySelector(
              '.epub-reader iframe',
            ) as HTMLIFrameElement;
            if (iframe && iframe.contentDocument) {
              logDebug('Clearing iframe selection');
              iframe.contentDocument.getSelection()?.removeAllRanges();
            }

            // Remove ghost highlight
            removeGhostHighlight();

            // Clear selection state
            setSelectionState({ text: '', range: null, position: null });
          }}
        />
      )}
    </div>
  );
};
