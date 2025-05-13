import React, { useRef, useEffect } from 'react';
import { useEPUBManifest } from '../../lib/queries';
import { IframeBuilder } from './IFrameBuilder';
import { useChapterNavigation } from '../../hooks/useChapterNavigation';
import { usePagination } from '../../hooks/usePagination';

// Debug logging
const DEBUG = true;
const logDebug = (message: string, data?: unknown) => {
  if (DEBUG) {
    console.log(`%c[MobileEPUBReader] ${message}`, 'color: #2196f3; font-weight: bold', data || '');
  }
};

interface MobileEPUBReaderProps {
  documentId: number;
}

const fetchChapterContent = async (chapterPath: string): Promise<string> => {
  logDebug('Fetching chapter content', { chapterPath });
  const response = await fetch(chapterPath);
  if (!response.ok) {
    throw new Error(`Failed to load chapter: ${response.statusText}`);
  }
  return response.text();
};

export const MobileEPUBReader: React.FC<MobileEPUBReaderProps> = ({ documentId }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { data: document, isLoading } = useEPUBManifest(documentId);
  const { currentChapter, error, setError, goToNextChapter, goToPreviousChapter } =
    useChapterNavigation({ document });

  const { currentPage, totalPages, nextPage, prevPage, initialize } = usePagination({
    iframeRef,
  });

  // Load chapter content
  useEffect(() => {
    if (!document || !iframeRef.current) {
      logDebug('No document or iframe available', {
        hasDocument: !!document,
        hasIframe: !!iframeRef.current,
      });
      return;
    }

    const documentCss = document.css;
    const chapterPath = document?.chapters[currentChapter];
    const iframe: HTMLIFrameElement = iframeRef.current;

    const loadChapter = async () => {
      try {
        logDebug('Loading chapter', { chapterPath, currentChapter });
        setError(null);
        const chapterHtml = await fetchChapterContent(chapterPath);
        const chapterDoc = new DOMParser().parseFromString(chapterHtml, 'application/xhtml+xml');

        logDebug('Building iframe content');
        await new IframeBuilder(iframe)
          .copyHtmlToIframe(chapterDoc)
          .injectPublisherStyles(documentCss)
          .injectCustomStyles()
          .build();

        logDebug('Chapter loaded successfully');

        // Initialize pagination after content is loaded
        const cleanup = initialize();
        return () => {
          cleanup?.();
        };
      } catch (error) {
        console.error('Error loading chapter:', error);
        setError(error instanceof Error ? error.message : 'Failed to load chapter');
      }
    };

    loadChapter();
  }, [document, currentChapter, setError, initialize]);

  const handlePrevPage = () => {
    logDebug('Previous page button clicked', { currentPage, totalPages });
    prevPage();
  };

  const handleNextPage = () => {
    logDebug('Next page button clicked', { currentPage, totalPages });
    nextPage();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!document) {
    return <div>No document found</div>;
  }

  return (
    <div
      className="epub-reader"
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <iframe
          ref={iframeRef}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            userSelect: 'text',
          }}
        />
        {/* Page navigation overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'space-between',
            pointerEvents: 'none',
          }}
        >
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            style={{
              width: '20%',
              height: '100%',
              opacity: 0.3,
              backgroundColor: currentPage === 0 ? 'transparent' : 'rgba(0, 0, 0, 0.1)',
              pointerEvents: 'auto',
              cursor: currentPage === 0 ? 'default' : 'pointer',
              border: 'none',
            }}
          />
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            style={{
              width: '20%',
              height: '100%',
              opacity: 0.3,
              backgroundColor:
                currentPage === totalPages - 1 ? 'transparent' : 'rgba(0, 0, 0, 0.1)',
              pointerEvents: 'auto',
              cursor: currentPage === totalPages - 1 ? 'default' : 'pointer',
              border: 'none',
            }}
          />
        </div>
      </div>
      <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={goToPreviousChapter} disabled={currentChapter === 0}>
          Previous Chapter
        </button>
        <span>
          {document.title} - Chapter {currentChapter + 1} (Page {currentPage + 1} of {totalPages})
        </span>
        <button
          onClick={goToNextChapter}
          disabled={currentChapter === document.chapters.length - 1}
        >
          Next Chapter
        </button>
      </div>
    </div>
  );
};
