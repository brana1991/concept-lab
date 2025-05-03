import React from 'react';
import UploadScreen from './UploadScreen';
import { useStore } from '../store';
import { parsePDF } from '../lib/parsePDF';
import { parseEPUB } from '../lib/parseEPUB';
import { FlipBook, PageContent } from './FlipBook';




const FileDropOrReader: React.FC = () => {
  const { setCurrentPage, setTotalPages } = useStore();
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
    <>
      {pages.length === 0 ? (
        <UploadScreen onFileUpload={handleFileUpload} />
      ) : (
        <FlipBook pages={pages} />
      )}
    </>
  );
};

export default FileDropOrReader;