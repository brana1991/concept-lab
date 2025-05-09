import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import cors from 'cors';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import { createEPUBRoutes } from './epub/epub.routes';
import { EPUBService } from './epub/epub.service';
import logger from './utils/logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Database connection
const { Pool } = pg;
const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'flipbook',
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
});

// Log database connection
pool.on('connect', () => {
  logger.info('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', { error: err });
});

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // Log request
  logger.debug(`${req.method} ${req.url}`, {
    query: req.query,
    params: req.params,
    body: req.body,
  });
  
  // Log response time when completed
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.debug(`${req.method} ${req.url} completed`, {
      statusCode: res.statusCode,
      duration: `${duration}ms`
    });
  });
  
  next();
});

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Cache-Control', 'Expires', 'Pragma'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: {
      connections: pool.totalCount,
      idle: pool.idleCount
    }
  });
});

// Serve static files from the EPUB output directory with proper headers
app.use('/epub', ((req: Request, res: Response, next: NextFunction) => {
  // Set CORS headers for static files
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Cache-Control, Expires, Pragma');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');
  
  // Set caching headers
  res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
  res.setHeader('Vary', 'Accept-Encoding');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  
  next();
}) as RequestHandler, express.static(path.join(__dirname, 'epub', 'output'), {
  // Enable directory listing for debugging
  dotfiles: 'deny',
  etag: true,
  lastModified: true,
  maxAge: '1h'
}));

// Initialize EPUB service and routes
const epubService = new EPUBService(pool);
app.use('/api/epub', createEPUBRoutes(epubService));

interface Document {
  id: number;
  filename: string;
  title: string;
  total_pages: number;
  created_at: Date;
}

// GET list of documents
app.get('/api/documents', (async (req: Request, res: Response) => {
  try {
    const result = await pool.query<Document>(
      'SELECT id, filename, title, total_pages, created_at FROM documents ORDER BY created_at DESC',
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}) as RequestHandler);

// GET document by ID
app.get('/api/documents/:id', (async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query<Document>(
      'SELECT id, filename, title, total_pages, created_at FROM documents WHERE id = $1',
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}) as RequestHandler);

interface Page {
  id: number;
  document_id: number;
  page_number: number;
  image_low_res: Buffer;
  image_high_res: Buffer;
  ocr_data: any;
}

// GET page metadata (without images) by document ID and page number
app.get('/api/documents/:id/pages/:pageNumber/metadata', (async (req: Request, res: Response) => {
  try {
    const { id, pageNumber } = req.params;
    const result = await pool.query<Page>(
      'SELECT id, document_id, page_number, image_low_res, image_high_res, ocr_data FROM pages WHERE document_id = $1 AND page_number = $2',
      [id, pageNumber],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching page metadata:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}) as RequestHandler);

// GET page image (low resolution)
app.get('/api/documents/:id/pages/:pageNumber/image-low', (async (req: Request, res: Response) => {
  try {
    const { id, pageNumber } = req.params;
    const result = await pool.query<{ image_low_res: Buffer }>(
      'SELECT image_low_res FROM pages WHERE document_id = $1 AND page_number = $2',
      [id, pageNumber],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Page not found' });
    }

    const image = result.rows[0].image_low_res;
    res.contentType('image/webp');
    res.send(image);
  } catch (error) {
    console.error('Error fetching low-res image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}) as RequestHandler);

// GET page image (high resolution)
app.get('/api/documents/:id/pages/:pageNumber/image-high', (async (req: Request, res: Response) => {
  try {
    const { id, pageNumber } = req.params;
    const result = await pool.query<{ image_high_res: Buffer }>(
      'SELECT image_high_res FROM pages WHERE document_id = $1 AND page_number = $2',
      [id, pageNumber],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Page not found' });
    }

    const image = result.rows[0].image_high_res;
    res.contentType('image/webp');
    res.send(image);
  } catch (error) {
    console.error('Error fetching high-res image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}) as RequestHandler);

// GET OCR data for a page
app.get('/api/documents/:id/pages/:pageNumber/ocr', (async (req: Request, res: Response) => {
  try {
    const { id, pageNumber } = req.params;
    const result = await pool.query<{ ocr_data: any }>(
      'SELECT ocr_data FROM pages WHERE document_id = $1 AND page_number = $2',
      [id, pageNumber],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json(result.rows[0].ocr_data);
  } catch (error) {
    console.error('Error fetching OCR data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}) as RequestHandler);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
}); 