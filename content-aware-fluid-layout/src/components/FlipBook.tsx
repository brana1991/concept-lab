import { useState } from 'react';
import './FlipBook.css';

interface PaperProps {
  backPage: string;
  frontPage: string;
  paperNumber: number;
  className?: string;
  onFlip: (pageNum: number) => void;
  zIndex: number;
}

const Paper = ({
  backPage,
  frontPage,
  paperNumber,
  className = '',
  onFlip,
  zIndex,
}: PaperProps) => {
  return (
    <div id={`paper-${paperNumber}`} className={`paper ${className}`} style={{ zIndex }}>
      <div className="back">
        <div className="back-content" onClick={() => onFlip(paperNumber)}>
          <img src={backPage} width={'100%'} height={'100%'} />
        </div>
      </div>
      <div className="front">
        <div className="front-content" onClick={() => onFlip(paperNumber)}>
          <img src={frontPage} width={'100%'} height={'100%'} />
        </div>
      </div>
    </div>
  );
};

interface Paper {
  frontPage: string;
  backPage: string;
}

export interface PageContent {
  type: 'img' | 'html';
  src: string;
}

interface Props {
  pages: PageContent[];
}

export const FlipBook = ({ pages }: Props) => {
  const [flippedPages, setFlippedPages] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1); // Track the current page
  const numOfPapers = pages.length;
  const buffer = 5; // Number of pages to render before and after the current page

  const handleFlip = (pageNum: number) => {
    setFlippedPages((prev) => {
      if (prev.includes(pageNum)) {
        return prev.filter((num) => num !== pageNum);
      } else {
        return [...prev, pageNum];
      }
    });
    setCurrentPage(pageNum); // Update the current page
  };

  return (
    <div className="wrapper">
      <div className="container">
        <div className="flipping-book">
          {pages.map((p, index) => {
            const paperNumber = index + 1;
            const isFlipped = flippedPages.includes(paperNumber);
            const zIndex = isFlipped ? 0 : numOfPapers - paperNumber;

            // Determine if the page should be rendered
            if (paperNumber < currentPage - buffer || paperNumber > currentPage + buffer) {
              return null; // Skip rendering pages outside the buffer range
            }

            const backpage = index === pages.length - 1 ? 'Kraj' : pages[index + 1].src;

            return (
              <Paper
                {...p}
                key={paperNumber}
                paperNumber={paperNumber}
                frontPage={p.src}
                backPage={backpage}
                className={isFlipped ? 'flipped' : ''}
                onFlip={handleFlip}
                zIndex={zIndex}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
