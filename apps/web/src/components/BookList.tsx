import React from 'react';
import { EPUBDocument } from '../lib/api';

interface BookListProps {
  books: EPUBDocument[];
  onSelectBook: (id: number) => void;
}

export const BookList: React.FC<BookListProps> = ({ books, onSelectBook }) => {
  return (
    <div className="book-list">
      <h1 className="book-list-title">Your Library</h1>
      <div className="book-grid">
        {books.map((book) => (
          <div key={book.id} className="book-card" onClick={() => onSelectBook(book.id)}>
            <div className="book-cover">
              {book.cover ? (
                <img src={book.cover} alt={`Cover of ${book.title}`} />
              ) : (
                <div className="book-cover-placeholder">
                  <span>{book.title.charAt(0)}</span>
                </div>
              )}
            </div>
            <div className="book-info">
              <h2 className="book-title">{book.title}</h2>
              <p className="book-author">{book.author}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
