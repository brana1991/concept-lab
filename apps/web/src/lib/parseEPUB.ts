import ePub from 'epubjs';

export const parseEPUB = async (file: File) => {
  const book = ePub(file);
  const rendition = book.renderTo('viewer', { flow: 'paginated' });
  const pages = [];

  rendition.on('relocated', (location) => {
    // Handle page change
  });

  await book.ready;
  // Extract pages or chapters as needed
  return pages;
};
