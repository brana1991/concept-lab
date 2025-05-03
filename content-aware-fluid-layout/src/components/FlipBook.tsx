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

const papers: Paper[] = [
  { frontPage: 'Front 1', backPage: 'B1' },
  { frontPage: 'Front 2', backPage: 'B2' },
  { frontPage: 'Front 3', backPage: 'B3' },
];

export const FlipBook = ({ pages }: Props) => {
  const numOfPapers = papers.length;
  const [flippedPages, setFlippedPages] = useState<number[]>([]);

  const handleFlip = (pageNum: number) => {
    setFlippedPages((prev) => {
      if (prev.includes(pageNum)) {
        return prev.filter((num) => num !== pageNum);
      } else {
        return [...prev, pageNum];
      }
    });
  };

  return (
    <div className="wrapper">
      <div className="container">
        <div className="flipping-book">
          {pages.map((p, index) => {
            const paperNumber = index + 1;
            const isFlipped = flippedPages.includes(paperNumber);
            const zIndex = isFlipped ? 0 : numOfPapers - paperNumber;

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
