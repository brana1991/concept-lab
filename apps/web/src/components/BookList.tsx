import React from 'react';
import { EPUBDocument } from '../lib/api';

interface BookListProps {
  books: EPUBDocument[];
  onSelectBook: (id: number) => void;
}

export const BookList: React.FC<BookListProps> = ({ books, onSelectBook }) => {
  console.log('Books data:', books);

  const getCoverUrl = (cover: string) => {
    console.log('Processing cover URL:', cover);
    if (!cover) return '';
    // Assuming book.cover from the manifest is already a full, URI-encoded URL
    return cover;
  };

  return (
    <div className="book-list">
      <h1 className="book-list-title">Your Library</h1>
      <div className="book-grid">
        {books.map((book) => {
          console.log('Book cover URL for styling:', book.cover ? getCoverUrl(book.cover) : 'none');
          return (
            <div key={book.id} className="book-card" onClick={() => onSelectBook(book.id)}>
              <div
                className="book-cover"
                style={{
                  backgroundImage: book.cover ? `url("${getCoverUrl(book.cover)}")` : 'none',
                }}
              >
                {!book.cover && (
                  <div className="book-cover-placeholder">{book?.title?.charAt(0)}</div>
                )}
              </div>
              <div className="book-info">
                <h2 className="book-title">{book.title}</h2>
                <p className="book-author">{book.author}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
