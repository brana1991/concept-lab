import { useQuery, useQueries } from '@tanstack/react-query';
import { api } from './api';

export function useDocuments() {
  return useQuery({
    queryKey: ['documents'],
    queryFn: () => api.getDocuments(),
  });
}

export function useDocument(id: number) {
  return useQuery({
    queryKey: ['document', id],
    queryFn: () => api.getDocument(id),
    enabled: !!id,
  });
}

export function useEPUBDocuments() {
  return useQuery({
    queryKey: ['epub-documents'],
    queryFn: () => api.getEPUBDocuments(),
  });
}

export function useEPUBManifest(id: number) {
  return useQuery({
    queryKey: ['epub-manifest', id],
    queryFn: () => api.getEpubManifest(id),
    enabled: !!id,
  });
}

export function usePageImage(documentId: number, pageNumber: number, dpi: 144 | 288 = 144) {
  return useQuery({
    queryKey: ['page-image', documentId, pageNumber, dpi],
    queryFn: () => api.getPageImage(documentId, pageNumber, dpi),
    enabled: !!documentId && pageNumber > 0,
  });
}

export function usePageOCR(documentId: number, pageNumber: number) {
  return useQuery({
    queryKey: ['page-ocr', documentId, pageNumber],
    queryFn: () => api.getPageOCR(documentId, pageNumber),
    enabled: !!documentId && pageNumber > 0,
  });
}

// Prefetch multiple pages at once (for smoother navigation)
export function usePrefetchPages(
  documentId: number,
  currentPage: number,
  prefetchCount: number = 2,
) {
  const pagesToFetch = Array.from(
    { length: prefetchCount * 2 + 1 },
    (_, i) => currentPage - prefetchCount + i,
  ).filter((page) => page > 0);

  return useQueries({
    queries: pagesToFetch.map((page) => ({
      queryKey: ['page-image', documentId, page, 144],
      queryFn: () => api.getPageImage(documentId, page, 144),
      enabled: !!documentId,
      staleTime: 5 * 60 * 1000, // Keep cached for 5 minutes
    })),
  });
}

export interface Highlight {
  id: number;
  document_id: number;
  chapter_id: number;
  anchor_id: string;
  start_offset: number;
  length: number;
  text: string | null;
  created_at: string;
}

export const useHighlights = (documentId: number) => {
  return useQuery<Highlight[]>({
    queryKey: ['highlights', documentId],
    refetchOnWindowFocus: false,
    queryFn: () => api.getHighlights(documentId),
  });
};
