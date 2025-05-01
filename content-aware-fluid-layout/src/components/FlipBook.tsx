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
        <div className="back-content" onClick={() => console.log('clicked')}>
          <h1>{backPage}</h1>
        </div>
      </div>
      <div className="front">
        <div className="front-content" onClick={() => onFlip(paperNumber)}>
          <h1>{frontPage}</h1>
        </div>
      </div>
    </div>
  );
};

interface Paper {
  frontPage: string;
  backPage: string;
}

const papers: Paper[] = [
  { frontPage: 'Front 1', backPage: 'Back 1' },
  { frontPage: 'Front 2', backPage: 'Back 2' },
  { frontPage: 'Front 3', backPage: 'Back 3' },
];

export const FlipBook = () => {
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
    <div className="container">
      <button className="prev">Prev</button>
      <div className="flipping-book">
        {papers.map((p, index) => {
          const paperNumber = index + 1;
          const isFlipped = flippedPages.includes(paperNumber);
          const zIndex = isFlipped ? 0 : numOfPapers - paperNumber;

          return (
            <Paper
              {...p}
              key={p.frontPage}
              paperNumber={paperNumber}
              className={isFlipped ? 'flipped' : ''}
              onFlip={handleFlip}
              zIndex={zIndex}
            />
          );
        })}
      </div>
      <button className="next">Next</button>
    </div>
  );
};
