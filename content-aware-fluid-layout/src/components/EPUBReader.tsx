import React, { useEffect, useRef, useState } from 'react';
import { useEPUBDocument } from '../lib/queries';
import '../../public/themes/default.css'; // Import the theme CSS

interface EPUBReaderProps {
  documentId: number;
  theme?: string;
}

// Types for better type safety
interface ChapterData {
  html: string;
  basePath: string;
}

// Utility functions
const createIframe = (container: HTMLDivElement): HTMLIFrameElement => {
  const iframe = window.document.createElement('iframe');
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  container.appendChild(iframe);
  return iframe;
};

const fixRelativePath = (path: string, basePath: string): string => {
  if (path.startsWith('/')) return path;
  return `${basePath}${path}`;
};

const injectStyles = (document: Document, publisherCssPath: string): void => {
  // Inject theme CSS as a style tag
  const themeStyle = document.createElement('style');
  themeStyle.textContent = `
    html, body {
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
    }
    body {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      box-sizing: border-box;
    }
    img {
      max-width: 100%;
      height: auto;
    }
    .chapter {
      max-width: 800px;
      width: 100%;
    }
  `;
  document.head.appendChild(themeStyle);

  // Inject publisher CSS
  const publisherCssLink = document.createElement('link');
  publisherCssLink.rel = 'stylesheet';
  publisherCssLink.href = publisherCssPath;
  document.head.appendChild(publisherCssLink);
};

const fetchChapterContent = async (chapterPath: string): Promise<ChapterData> => {
  const response = await fetch(chapterPath, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to load chapter: ${response.statusText}`);
  }

  const html = await response.text();
  const basePath = chapterPath.substring(0, chapterPath.lastIndexOf('/') + 1);

  return { html, basePath };
};

const processDocumentContent = (doc: Document, basePath: string): void => {
  // Fix paths in the document
  doc.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
    const href = link.getAttribute('href');
    if (href) {
      link.setAttribute('href', fixRelativePath(href, basePath));
    }
  });

  doc.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src');
    if (src) {
      img.setAttribute('src', fixRelativePath(src, basePath));
    }
  });
};

const copyContentToIframe = (sourceDoc: Document, iframeDoc: Document): void => {
  // Copy the head content
  const headContent = sourceDoc.querySelector('head');
  if (headContent) {
    Array.from(headContent.children).forEach((child) => {
      iframeDoc.head.appendChild(child.cloneNode(true));
    });
  }

  // Copy the body content
  const bodyContent = sourceDoc.querySelector('body');
  if (bodyContent) {
    iframeDoc.body.innerHTML = bodyContent.innerHTML;
  }
};

export const EPUBReader: React.FC<EPUBReaderProps> = ({ documentId, theme = 'default' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Fetch EPUB document data
  const { data: document, isLoading } = useEPUBDocument(documentId);

  useEffect(() => {
    if (!containerRef.current || !document) return;

    console.log('Initializing reader with document:', document);
    const iframe = createIframe(containerRef.current);

    const loadChapter = async () => {
      try {
        setError(null);
        const chapterPath = document.chapters[currentChapter].split('/epub-output/')[1];
        console.log('Loading chapter from:', chapterPath);

        const { html, basePath } = await fetchChapterContent(chapterPath);
        console.log('Loaded HTML:', html.substring(0, 200) + '...');

        if (!iframe.contentDocument) {
          throw new Error('Could not access iframe content document');
        }

        // Parse the XHTML content
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'application/xhtml+xml');

        // Process document content
        processDocumentContent(doc, basePath);

        // Clear and prepare iframe
        iframe.contentDocument.open();
        iframe.contentDocument.write('<!DOCTYPE html><html><head></head><body></body></html>');
        iframe.contentDocument.close();

        // Inject styles
        injectStyles(iframe.contentDocument, document.css.split('/epub-output/')[1]);

        // Copy content to iframe
        copyContentToIframe(doc, iframe.contentDocument);
      } catch (error) {
        console.error('Error loading chapter:', error);
        setError(error instanceof Error ? error.message : 'Failed to load chapter');
      }
    };

    loadChapter();

    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(iframe);
      }
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        ref={containerRef}
        style={{
          flex: 1,
          width: '100%',
          overflow: 'hidden',
        }}
      />
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
    </div>
  );
};
