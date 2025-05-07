import React, { useEffect, useRef, useState } from 'react';
import { useEPUBDocument } from '../lib/queries';
import '../../public/themes/default.css'; // Import the theme CSS

interface EPUBReaderProps {
  documentId: number;
  theme?: string;
}

export const EPUBReader: React.FC<EPUBReaderProps> = ({ documentId, theme = 'default' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Fetch EPUB document data
  const { data: document, isLoading } = useEPUBDocument(documentId);

  useEffect(() => {
    if (!containerRef.current || !document) return;

    console.log('Initializing reader with document:', document);

    const iframe = window.document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    containerRef.current.appendChild(iframe);

    const loadChapter = async () => {
      try {
        setError(null);
        // Get the chapter path relative to the public directory
        const chapterPath = document.chapters[currentChapter].split('/epub-output/')[1];
        console.log('Loading chapter from:', chapterPath);

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
        console.log('Loaded HTML:', html.substring(0, 200) + '...'); // Log first 200 chars

        if (!iframe.contentDocument) {
          throw new Error('Could not access iframe content document');
        }

        // Parse the XHTML content
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'application/xhtml+xml');

        // Get the base path for this chapter
        const chapterBasePath = chapterPath.substring(0, chapterPath.lastIndexOf('/') + 1);

        // Function to fix relative paths
        const fixRelativePath = (path: string) => {
          if (path.startsWith('/')) return path;
          return `${chapterBasePath}${path}`;
        };

        // Fix paths in the document
        doc.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
          const href = link.getAttribute('href');
          if (href) {
            link.setAttribute('href', fixRelativePath(href));
          }
        });

        doc.querySelectorAll('img').forEach((img) => {
          const src = img.getAttribute('src');
          if (src) {
            img.setAttribute('src', fixRelativePath(src));
          }
        });

        // Clear existing content
        iframe.contentDocument.open();
        iframe.contentDocument.write('<!DOCTYPE html><html><head></head><body></body></html>');
        iframe.contentDocument.close();

        // Inject theme CSS as a style tag
        const themeStyle = iframe.contentDocument.createElement('style');
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
        iframe.contentDocument.head.appendChild(themeStyle);

        // Then inject publisher CSS
        const publisherCssLink = iframe.contentDocument.createElement('link');
        publisherCssLink.rel = 'stylesheet';
        publisherCssLink.href = document.css.split('/epub-output/')[1];
        iframe.contentDocument.head.appendChild(publisherCssLink);

        // Copy the head content
        const headContent = doc.querySelector('head');
        if (headContent) {
          Array.from(headContent.children).forEach((child) => {
            iframe.contentDocument?.head.appendChild(child.cloneNode(true));
          });
        }

        // Copy the body content
        const bodyContent = doc.querySelector('body');
        if (bodyContent) {
          iframe.contentDocument.body.innerHTML = bodyContent.innerHTML;
        }
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
