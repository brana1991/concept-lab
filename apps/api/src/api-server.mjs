import express from 'express';
import cors from 'cors';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

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
  port: process.env.PGPORT || 5432,
});

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Cache-Control', 'Expires', 'Pragma'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));
app.use(express.json());

// Serve static files from the EPUB output directory with proper headers
app.use('/epub', (req, res, next) => {
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
}, express.static(path.join(__dirname, 'epub', 'output'), {
  // Enable directory listing for debugging
  dotfiles: 'deny',
  etag: true,
  lastModified: true,
  maxAge: '1h'
}));

// GET list of documents
app.get('/api/documents', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, filename, title, total_pages, created_at FROM documents ORDER BY created_at DESC',
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET document by ID
app.get('/api/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
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
});

// GET page metadata (without images) by document ID and page number
app.get('/api/documents/:id/pages/:pageNumber/metadata', async (req, res) => {
  try {
    const { id, pageNumber } = req.params;
    const result = await pool.query(
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
});

// GET page image (low resolution)
app.get('/api/documents/:id/pages/:pageNumber/image-low', async (req, res) => {
  try {
    const { id, pageNumber } = req.params;
    const result = await pool.query(
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
});

// GET page image (high resolution)
app.get('/api/documents/:id/pages/:pageNumber/image-high', async (req, res) => {
  try {
    const { id, pageNumber } = req.params;
    const result = await pool.query(
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
});

// GET OCR data for a page
app.get('/api/documents/:id/pages/:pageNumber/ocr', async (req, res) => {
  try {
    const { id, pageNumber } = req.params;
    const result = await pool.query(
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
});

// Start the server
app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});
