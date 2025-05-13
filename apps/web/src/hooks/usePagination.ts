import { useCallback, useRef, useState } from 'react';

interface UsePaginationProps {
  iframeRef: React.RefObject<HTMLIFrameElement>;
}

interface PaginationState {
  currentPage: number;
  totalPages: number;
  pageWidth: number;
}

// Debug logging
const DEBUG = true;
const logDebug = (message: string, data?: unknown) => {
  if (DEBUG) {
    console.log(`%c[usePagination] ${message}`, 'color: #4CAF50; font-weight: bold', data || '');
  }
};

export const usePagination = ({ iframeRef }: UsePaginationProps) => {
  const [paginationState, setPaginationState] = useState<PaginationState>({
    currentPage: 0,
    totalPages: 0,
    pageWidth: 0,
  });

  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const isScrolling = useRef(false);

  const updatePagination = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) {
      logDebug('No iframe or contentWindow available');
      return;
    }

    const win = iframe.contentWindow;
    const reader = win.document.getElementById('reader');
    if (!reader) {
      logDebug('No reader element found');
      return;
    }

    const pageWidth = win.innerWidth;
    const contentWidth = reader.scrollWidth;
    const totalPages = Math.ceil(contentWidth / pageWidth);
    const currentPage = Math.round(reader.scrollLeft / pageWidth);

    logDebug('Updating pagination state', {
      pageWidth,
      contentWidth,
      totalPages,
      currentPage,
      scrollLeft: reader.scrollLeft,
    });

    setPaginationState({
      currentPage,
      totalPages,
      pageWidth,
    });
  }, [iframeRef]);

  const scrollToPage = useCallback(
    (page: number) => {
      logDebug('Scrolling to page', { page, currentState: paginationState });

      const iframe = iframeRef.current;
      if (!iframe?.contentWindow) return;

      const reader = iframe.contentWindow.document.getElementById('reader');
      if (!reader) return;

      isScrolling.current = true;
      const targetScroll = page * paginationState.pageWidth;

      reader.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });

      setPaginationState((prev) => ({
        ...prev,
        currentPage: page,
      }));

      setTimeout(() => {
        isScrolling.current = false;
      }, 300);
    },
    [paginationState, iframeRef],
  );

  const nextPage = useCallback(() => {
    if (isScrolling.current) return;
    const nextPage = Math.min(paginationState.currentPage + 1, paginationState.totalPages - 1);
    scrollToPage(nextPage);
  }, [paginationState.currentPage, paginationState.totalPages, scrollToPage]);

  const prevPage = useCallback(() => {
    if (isScrolling.current) return;
    const prevPage = Math.max(paginationState.currentPage - 1, 0);
    scrollToPage(prevPage);
  }, [paginationState.currentPage, scrollToPage]);

  const initialize = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) {
      logDebug('No iframe or contentWindow available for initialization');
      return;
    }
    const win = iframe.contentWindow;
    const reader = win.document.getElementById('reader');
    if (!reader) {
      logDebug('No reader element found for initialization');
      return;
    }

    // Create ResizeObserver
    resizeObserverRef.current = new ResizeObserver(updatePagination);
    resizeObserverRef.current.observe(reader);

    // Initial update
    updatePagination();

    return () => {
      resizeObserverRef.current?.disconnect();
    };
  }, [iframeRef, updatePagination]);

  return {
    ...paginationState,
    nextPage,
    prevPage,
    initialize,
  };
};
