import React, { useRef, useEffect } from 'react';
import { useEPUBManifest } from '../../lib/queries';
import { SelectionMenu } from '../SelectionMenu';
import '../../styles/selection.css';
import { IframeBuilder } from './IFrameBuilder';
import { useSelection } from '../../hooks/useSelection';
import { useSelectionActions } from '../../hooks/useSelectionActions';
import { useChapterNavigation } from '../../hooks/useChapterNavigation';

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
  const { data: document, isLoading } = useEPUBManifest(documentId);
  const { currentChapter, error, setError, goToNextChapter, goToPreviousChapter } =
    useChapterNavigation({ document });

  const { selectionState, handleSelection, clearSelection } = useSelection({ iframeRef });
  const { handleHighlight, handleCopy, handleAddNote, handleAskAI } = useSelectionActions({
    selectionState,
    iframeRef,
    onSelectionClear: clearSelection,
  });

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
          iframe.contentDocument.addEventListener('mouseup', handleSelection);
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
  }, [document, currentChapter, theme, handleSelection, setError]);

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
          onCancel={clearSelection}
        />
      )}
    </div>
  );
};
