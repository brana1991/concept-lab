import React from 'react';
import HTMLFlipBook from 'react-pageflip';

interface PageContent {
  type: 'img' | 'html';
  src: string;
}

interface ReaderProps {
  pages: PageContent[];
}

const Reader: React.FC<ReaderProps> = ({ pages }) => {
  console.log('Pages:', pages);
  return (
    <HTMLFlipBook
      width={680}
      height={900}
      size="stretch"
      minWidth={315}
      maxWidth={1000}
      minHeight={400}
      maxHeight={1536}
      maxShadowOpacity={0.5}
      showCover={true}
      mobileScrollSupport={false}
      className="flip-book"
      style={{ margin: '0 auto' }}
      startPage={0}
      drawShadow={true}
      flippingTime={450}
      usePortrait={true}
      startZIndex={0}
      autoSize={true}
      clickEventForward={true}
      useMouseEvents={true}
      swipeDistance={30}
      showPageCorners={true}
      disableFlipByClick={false}
    >
      {pages.map((page, index) => (
        <div key={index} className="page">
          {page.type === 'img' ? (
            <img src={page.src} alt={`Page ${index + 1}`} />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: page.src }} />
          )}
        </div>
      ))}
    </HTMLFlipBook>
  );
};

export default Reader;
