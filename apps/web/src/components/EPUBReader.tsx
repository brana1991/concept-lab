import React, { useEffect, useRef, useState } from 'react';
import { useEPUBDocument } from '../lib/queries';
import '../../public/themes/default.css'; // Import the theme CSS
import { useTextSelection } from '../hooks/useTextSelection';
import { SelectionMenu } from './SelectionMenu';
import '../styles/selection.css';

// Debug logging
const DEBUG = true;
const logDebug = (message: string, data?: any) => {
  if (DEBUG) {
    console.log(`%c[EPUBReader] ${message}`, 'color: #2196f3; font-weight: bold', data || '');
  }
};

interface EPUBReaderProps {
  documentId: number;
  theme?: string;
}

// Types for better type safety
interface ChapterData {
  html: string;
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

const injectStyles = (document: Document, cssPaths: string[]): void => {
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

  // Inject all publisher CSS files
  cssPaths.forEach(cssPath => {
    const publisherCssLink = document.createElement('link');
    publisherCssLink.rel = 'stylesheet';
    publisherCssLink.href = cssPath;
    document.head.appendChild(publisherCssLink);
  });
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
  return { html };
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
  const { data: document, isLoading } = useEPUBDocument(documentId);

  // We're handling selection directly in this component now
  useTextSelection({ iframeRef });

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
      navigator.clipboard.writeText(selectionState.text)
        .then(() => logDebug('Text copied to clipboard'))
        .catch(e => logDebug('Error copying to clipboard', e));
      
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
  const getSentenceContainingRange = (range: Range, iframeDoc: Document): string => {
    try {
      const text = range.toString().trim();
      const container = range.commonAncestorContainer;
      const textContent = container.textContent || '';
      
      // Simple sentence splitting - can be improved
      const sentences = textContent.split(/[.!?]+\s+/);
      const sentence = sentences.find(s => s.includes(text)) || text;
      
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
    if (!containerRef.current || !document) return;

    logDebug('Initializing reader with document:', document);
    const iframe = createIframe(containerRef.current);
    iframeRef.current = iframe;
    logDebug('Created iframe', iframe);

    const loadChapter = async () => {
      try {
        setError(null);
        const chapterPath = document.chapters[currentChapter];
        logDebug('Loading chapter from:', chapterPath);

        const { html } = await fetchChapterContent(chapterPath);
        logDebug('Loaded HTML length:', html.length);

        if (!iframe.contentDocument) {
          throw new Error('Could not access iframe content document');
        }

        // Parse the XHTML content
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'application/xhtml+xml');
        logDebug('Parsed HTML document', doc);

        // Clear and prepare iframe
        iframe.contentDocument.open();
        iframe.contentDocument.write('<!DOCTYPE html><html><head></head><body></body></html>');
        iframe.contentDocument.close();
        logDebug('Prepared iframe document');

        // Inject styles
        injectStyles(iframe.contentDocument, document.css);
        logDebug('Injected styles to iframe');

        // Copy content to iframe
        copyContentToIframe(doc, iframe.contentDocument);
        logDebug('Copied content to iframe');

        // Make iframe accessible to other components
        iframe.setAttribute('data-ready', 'true');
        
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
                const sentence = getSentenceContainingRange(range, iframeDoc);
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
                    y: menuY
                  }
                });
              } catch (e) {
                logDebug('Error handling selection', e);
              }
            }, 100);
          });
          
          iframe.contentDocument.addEventListener('click', (e) => {
            logDebug('Iframe click', { 
              target: e.target,
              x: e.clientX, 
              y: e.clientY 
            });
          });
          
          iframe.contentDocument.addEventListener('pointerup', (e) => {
            logDebug('Iframe pointerup', { 
              target: e.target,
              x: e.clientX, 
              y: e.clientY 
            });
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
    <div className="epub-reader" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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
            const iframe = window.document.querySelector('.epub-reader iframe') as HTMLIFrameElement;
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
