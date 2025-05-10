import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api';

interface CreateHighlightParams {
  documentId: number;
  chapterId: number;
  anchorId: string;
  startOffset: number;
  length: number;
  text: string;
}

export const useCreateHighlight = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateHighlightParams) => {
      return api.createHighlight(params.documentId, {
        chapterId: params.chapterId,
        anchorId: params.anchorId,
        startOffset: params.startOffset,
        length: params.length,
        text: params.text,
      });
    },
    onSuccess: (_, variables) => {
      // Invalidate highlights query to refetch
      queryClient.invalidateQueries({ queryKey: ['highlights', variables.documentId] });
    },
  });
};
