import { useState } from 'react';

interface Chapter {
  title: string;
  chapters: string[];
  css: string[];
}

interface UseChapterNavigationProps {
  document: Chapter | undefined;
}

export const useChapterNavigation = ({ document }: UseChapterNavigationProps) => {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [error, setError] = useState<string | null>(null);

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

  return {
    currentChapter,
    error,
    setError,
    goToNextChapter,
    goToPreviousChapter,
  };
};
