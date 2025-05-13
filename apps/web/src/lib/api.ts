const API_BASE_URL = '/api';
export const STATIC_BASE_URL = 'http://localhost:3000';

export interface OCRBox {
  text: string;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface PageData {
  id: number;
  document_id: number;
  page_number: number;
  ocr_data: OCRBox[];
}

export interface Document {
  id: number;
  filename: string;
  total_pages: number;
}

interface EPUBDocument {
  id: number;
  title: string;
  author: string;
  epubPath: string;
  chapters: string[];
  css: string[];
  cover: string;
  createdAt: string;
}

export const api = {
  async getDocuments(): Promise<Document[]> {
    const response = await fetch(`${API_BASE_URL}/documents`);
    if (!response.ok) throw new Error('Failed to fetch documents');
    return response.json();
  },

  async getDocument(id: number): Promise<Document> {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch document ${id}`);
    return response.json();
  },

  async getPageImage(
    documentId: number,
    pageNumber: number,
    dpi: 144 | 288 = 144,
  ): Promise<string> {
    const response = await fetch(
      `${API_BASE_URL}/documents/${documentId}/pages/${pageNumber}/image?dpi=${dpi}`,
    );
    if (!response.ok) throw new Error(`Failed to fetch image for page ${pageNumber}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  },

  async getPageOCR(documentId: number, pageNumber: number): Promise<PageData> {
    const response = await fetch(`${API_BASE_URL}/documents/${documentId}/pages/${pageNumber}/ocr`);
    if (!response.ok) throw new Error(`Failed to fetch OCR data for page ${pageNumber}`);
    return response.json();
  },

  getEPUBDocuments: async (): Promise<EPUBDocument[]> => {
    const response = await fetch(`${API_BASE_URL}/epub/documents`);
    if (!response.ok) throw new Error('Failed to fetch documents');
    return response.json();
  },

  getEpubManifest: async (id: number): Promise<EPUBDocument> => {
    const response = await fetch(`${API_BASE_URL}/epub/documents/${id}`);
    if (!response.ok) throw new Error('Failed to fetch document with id: ' + id);

    const jsonResponse = await response.json();
    // Convert absolute URL to relative URL
    const manifestUrl = new URL(jsonResponse.manifest_url);
    const manifestResponse = await fetch(manifestUrl.pathname);

    if (!manifestResponse.ok)
      throw new Error('Failed to fetch manifest for document with id: ' + id);
    const manifest = await manifestResponse.json();

    // Convert any absolute URLs in the manifest to relative URLs
    if (manifest.chapters) {
      manifest.chapters = manifest.chapters.map((url: string) => {
        try {
          const chapterUrl = new URL(url);
          return chapterUrl.pathname;
        } catch {
          // If URL parsing fails, assume it's already a relative path
          return url;
        }
      });
    }
    if (manifest.css) {
      manifest.css = manifest.css.map((url: string) => {
        try {
          const cssUrl = new URL(url);
          return cssUrl.pathname;
        } catch {
          // If URL parsing fails, assume it's already a relative path
          return url;
        }
      });
    }
    if (manifest.cover) {
      try {
        const coverUrl = new URL(manifest.cover);
        manifest.cover = coverUrl.pathname;
      } catch {
        // If URL parsing fails, assume it's already a relative path
      }
    }

    return manifest;
  },

  // Highlight methods
  createHighlight: async (
    documentId: number,
    params: {
      chapterId: number;
      anchorId: string;
      startOffset: number;
      length: number;
      text: string;
    },
  ) => {
    const response = await fetch(`${API_BASE_URL}/epub/documents/${documentId}/highlights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Failed to create highlight');
    }

    return response.json();
  },

  getHighlights: async (documentId: number) => {
    const response = await fetch(`${API_BASE_URL}/epub/documents/${documentId}/highlights`);
    if (!response.ok) {
      throw new Error('Failed to fetch highlights');
    }
    return response.json();
  },
};
