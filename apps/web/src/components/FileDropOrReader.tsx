import React, { useState } from 'react';
import UploadScreen from './UploadScreen';
import { useStore } from '../store';
import { parsePDF } from '../lib/parsePDF';
import { FlipBook, PageContent } from './FlipBook';
import { EPUBReader } from './E-Reader/EPUBReader';
import { useEPUBDocuments } from '../lib/queries';

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
    return <div>Loading available documents...</div>;
  }

  return (
    <>
      {!selectedEPUBId && pages.length === 0 ? (
        <div>
          <UploadScreen onFileUpload={handleFileUpload} />
          {epubDocuments && epubDocuments.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h2>Available EPUB Documents</h2>
              <ul>
                {epubDocuments.map((doc) => (
                  <li key={doc.id}>
                    <button onClick={() => setSelectedEPUBId(doc.id)}>
                      {doc.title} by {doc.author}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : selectedEPUBId ? (
        <EPUBReader documentId={selectedEPUBId} />
      ) : (
        <FlipBook pages={pages} />
      )}
    </>
  );
};

export default FileDropOrReader;
