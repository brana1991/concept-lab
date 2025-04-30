import React from 'react';
import UploadScreen from './UploadScreen';
import Reader from './Reader';
import { useStore } from '../store';
import { parsePDF } from '../lib/parsePDF';
import { parseEPUB } from '../lib/parseEPUB';

interface PageContent {
  type: 'img' | 'html';
  src: string;
}

const FileDropOrReader: React.FC = () => {
  const { currentPage, totalPages, setCurrentPage, setTotalPages } = useStore();
  const [pages, setPages] = React.useState<PageContent[]>([]);

  const handleFileUpload = async (file: File) => {
    let parsedPages: PageContent[] = [];
    if (file.type === 'application/pdf') {
      const imageData = await parsePDF(file);
      parsedPages = imageData.map((src) => ({ type: 'img', src }));
    } else if (file.type === 'application/epub+zip') {
      const htmlData = await parseEPUB(file);
      parsedPages = htmlData.map((src) => ({ type: 'html', src }));
    }
    console.log('Parsed Pages:', parsedPages);
    setPages(parsedPages);
    setTotalPages(parsedPages.length);
    setCurrentPage(1);
  };

  return (
    <div>
      {pages.length === 0 ? (
        <UploadScreen onFileUpload={handleFileUpload} />
      ) : (
        <Reader pages={pages} />
      )}
    </div>
  );
};

export default FileDropOrReader;