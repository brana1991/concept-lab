import React, { useState } from 'react';
import UploadScreen from './UploadScreen';
import { useStore } from '../store';
import { parsePDF } from '../lib/parsePDF';
import { FlipBook, PageContent } from './FlipBook';
import { MobileEPUBReader } from './E-Reader/MobileEPUBReader';
import { useEPUBDocuments } from '../lib/queries';
import { BookList } from './BookList';
import '../styles/books.scss';

interface PDFPage {
  dataUrl: string;
  width: number;
  height: number;
}

const FileDropOrReader: React.FC = () => {
  const { setCurrentPage, setTotalPages } = useStore();
  const [pages, setPages] = React.useState<PageContent[]>([]);
  const [selectedEPUBId, setSelectedEPUBId] = useState<number | null>(null);

  // Fetch available EPUB documents
  const { data: epubDocuments, isLoading: isLoadingEPUBs } = useEPUBDocuments();

  const handleFileUpload = async (file: File) => {
    if (file.type === 'application/pdf') {
      const imageData = await parsePDF(file);
      const parsedPages: PageContent[] = imageData.map((page: PDFPage) => ({
        type: 'img' as const,
        src: page.dataUrl,
      }));
      setPages(parsedPages);
      setTotalPages(parsedPages.length);
      setCurrentPage(1);
    }
  };

  if (isLoadingEPUBs) {
    return <div className="loading-state">Loading your library...</div>;
  }

  return (
    <>
      {!selectedEPUBId && pages.length === 0 ? (
        <div>
          <UploadScreen onFileUpload={handleFileUpload} />
          {epubDocuments && epubDocuments.length > 0 && (
            <BookList books={epubDocuments} onSelectBook={setSelectedEPUBId} />
          )}
        </div>
      ) : selectedEPUBId ? (
        <MobileEPUBReader documentId={selectedEPUBId} />
      ) : (
        <FlipBook pages={pages} />
      )}
    </>
  );
};

export default FileDropOrReader;
