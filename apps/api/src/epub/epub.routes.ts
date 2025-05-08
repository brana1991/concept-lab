import express from 'express';
import type { Request, Response, Router, RequestHandler } from 'express';
import { EPUBService } from './epub.service';

export function createEPUBRoutes(epubService: EPUBService): Router {
  const router = express.Router();

  // Get all documents
  router.get('/documents', (async (req: Request, res: Response) => {
    try {
      const documents = await epubService.getAllDocuments();
      res.json(documents);
    } catch (error) {
      console.error('Error fetching documents:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }) as RequestHandler);

  // Get document by ID
  router.get('/documents/:id', (async (req: Request, res: Response) => {
    try {
      const document = await epubService.getDocument(Number(req.params.id));
      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }
      res.json(document);
    } catch (error) {
      console.error('Error fetching document:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }) as RequestHandler);

  // Get document chapters
  router.get('/documents/:id/chapters', (async (req: Request, res: Response) => {
    try {
      const chapters = await epubService.getDocumentChapters(Number(req.params.id));
      res.json(chapters);
    } catch (error) {
      console.error('Error fetching chapters:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }) as RequestHandler);

  // Create highlight
  router.post('/documents/:id/highlights', (async (req: Request, res: Response) => {
    try {
      const { chapterId, anchorId, startOffset, length, text } = req.body;
      const highlight = await epubService.createHighlight(
        Number(req.params.id),
        Number(chapterId),
        anchorId,
        startOffset,
        length,
        text
      );
      res.status(201).json(highlight);
    } catch (error) {
      console.error('Error creating highlight:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }) as RequestHandler);

  // Get document highlights
  router.get('/documents/:id/highlights', (async (req: Request, res: Response) => {
    try {
      const highlights = await epubService.getDocumentHighlights(Number(req.params.id));
      res.json(highlights);
    } catch (error) {
      console.error('Error fetching highlights:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }) as RequestHandler);

  // Create note
  router.post('/documents/:id/notes', (async (req: Request, res: Response) => {
    try {
      const { highlightId, content } = req.body;
      const note = await epubService.createNote(
        Number(highlightId),
        content
      );
      res.status(201).json(note);
    } catch (error) {
      console.error('Error creating note:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }) as RequestHandler);

  // Get document notes
  router.get('/documents/:id/notes', (async (req: Request, res: Response) => {
    try {
      const notes = await epubService.getDocumentNotes(Number(req.params.id));
      res.json(notes);
    } catch (error) {
      console.error('Error fetching notes:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }) as RequestHandler);

  return router;
} 