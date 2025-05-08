import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

export interface Document {
  id: number;
  title: string;
  author: string | null;
  manifest_url: string;
  total_chapters: number;
  uploaded_at: Date;
}

export interface Chapter {
  id: number;
  document_id: number;
  idx: number;
  file_path: string;
  title: string | null;
}

export interface Highlight {
  id: number;
  document_id: number;
  chapter_id: number;
  anchor_id: string;
  start_offset: number;
  length: number;
  text: string | null;
  created_at: Date;
}

export interface Note {
  id: number;
  highlight_id: number;
  content: string;
  created_at: Date;
}

export class EPUBService {
  constructor(public pool: Pool) {}

  async createDocument(title: string, author: string, manifestUrl: string): Promise<Document> {
    const result = await this.pool.query(
      `INSERT INTO documents (title, author, manifest_url, total_chapters)
       VALUES ($1, $2, $3, 0)
       RETURNING *`,
      [title, author, manifestUrl]
    );
    return result.rows[0];
  }

  async createChapter(documentId: number, title: string | null, filePath: string, idx: number): Promise<Chapter> {
    const result = await this.pool.query(
      `INSERT INTO chapters (document_id, title, file_path, idx)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [documentId, title, filePath, idx]
    );
    return result.rows[0];
  }

  async createHighlight(documentId: number, chapterId: number, anchorId: string, startOffset: number, length: number, text: string | null): Promise<Highlight> {
    const result = await this.pool.query(
      `INSERT INTO highlights (document_id, chapter_id, anchor_id, start_offset, length, text)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [documentId, chapterId, anchorId, startOffset, length, text]
    );
    return result.rows[0];
  }

  async createNote(highlightId: number, content: string): Promise<Note> {
    const result = await this.pool.query(
      `INSERT INTO notes (highlight_id, content)
       VALUES ($1, $2)
       RETURNING *`,
      [highlightId, content]
    );
    return result.rows[0];
  }

  async getDocument(id: number): Promise<Document | null> {
    const result = await this.pool.query(
      'SELECT * FROM documents WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async getDocumentChapters(documentId: number): Promise<Chapter[]> {
    const result = await this.pool.query(
      'SELECT * FROM chapters WHERE document_id = $1 ORDER BY idx ASC',
      [documentId]
    );
    return result.rows;
  }

  async getDocumentHighlights(documentId: number): Promise<Highlight[]> {
    const result = await this.pool.query(
      'SELECT * FROM highlights WHERE document_id = $1 ORDER BY created_at DESC',
      [documentId]
    );
    return result.rows;
  }

  async getDocumentNotes(documentId: number): Promise<Note[]> {
    const result = await this.pool.query(
      `SELECT n.* FROM notes n
       JOIN highlights h ON h.id = n.highlight_id
       WHERE h.document_id = $1
       ORDER BY n.created_at DESC`,
      [documentId]
    );
    return result.rows;
  }

  async updateDocumentChapters(documentId: number, totalChapters: number): Promise<void> {
    await this.pool.query(
      'UPDATE documents SET total_chapters = $1 WHERE id = $2',
      [totalChapters, documentId]
    );
  }

  async getAllDocuments(): Promise<Document[]> {
    const result = await this.pool.query(
      'SELECT * FROM documents ORDER BY uploaded_at DESC'
    );
    return result.rows;
  }
}