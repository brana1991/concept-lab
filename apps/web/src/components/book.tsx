import React, { useState } from 'react';
import './Book.css'; // Import the CSS for animations

interface PageContent {
  type: 'img' | 'html';
  src: string;
}

interface BookProps {
  pages: PageContent[];
}

const Book: React.FC<BookProps> = ({ pages }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [flipping, setFlipping] = useState(false);

  const nextPage = () => {
    if (currentPage < pages.length - 2) {
      setFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 2);
        setFlipping(false);
      }, 600); // Match the transition duration
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 2);
        setFlipping(false);
      }, 600); // Match the transition duration
    }
  };

  return (
    <div className="book">
      <div className="page-container">
        {pages.map((page, index) => (
          <div
            key={index}
            className={`page ${
              index === currentPage ? 'visible' : ''
            } ${index === currentPage + 1 ? 'back' : ''} ${
              flipping && index === currentPage ? 'flipping' : ''
            }`}
            style={{ gridColumn: index % 2 === 0 ? '1' : '2' }}
          >
            {page.type === 'img' ? (
              <img src={page.src} alt={`Page ${index + 1}`} />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: page.src }} />
            )}
          </div>
        ))}
      </div>
      <div className="controls">
        <button onClick={prevPage} disabled={currentPage === 0}>
          Previous
        </button>
        <button onClick={nextPage} disabled={currentPage >= pages.length - 2}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Book;
