import { useEffect, RefObject } from 'react';

const DEBUG = true;
const logDebug = (message: string, data?: any) => {
  if (DEBUG) {
    console.log(`%c[TextSelection] ${message}`, 'color: #9c27b0; font-weight: bold', data || '');
  }
};

interface UseTextSelectionProps {
  iframeRef?: RefObject<HTMLIFrameElement>;
}

/**
 * This hook injects the necessary styles for text selection into the iframe
 */
export const useTextSelection = (props?: UseTextSelectionProps) => {
  useEffect(() => {
    logDebug('Setting up text selection styles');
    
    // Set up a checker for iframe readiness
    const iframeReadyChecker = setInterval(() => {
      const iframe = props?.iframeRef?.current;
      if (iframe?.contentDocument && iframe.getAttribute('data-ready') === 'true') {
        logDebug('Found ready iframe, injecting styles', iframe);
        clearInterval(iframeReadyChecker);
        
        const iframeDoc = iframe.contentDocument;
        
        // Inject selection styles
        if (!iframeDoc.querySelector('style.selection-styles')) {
          const style = iframeDoc.createElement('style');
          style.className = 'selection-styles';
          style.textContent = `
            .ghost-sentence {
              background: rgba(255, 236, 140, 0.3);
              transition: background-color 0.2s ease;
            }
            
            .user-highlight {
              background-color: rgba(255, 236, 140, 0.5);
              border-radius: 2px;
            }
          `;
          iframeDoc.head.appendChild(style);
          logDebug('Injected selection styles into iframe');
        }
      }
    }, 500);
    
    return () => {
      logDebug('Cleaning up text selection');
      clearInterval(iframeReadyChecker);
    };
  }, [props?.iframeRef]);
}; 