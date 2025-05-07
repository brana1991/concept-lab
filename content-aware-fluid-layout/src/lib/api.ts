const API_BASE_URL = 'http://localhost:3000/api';

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
  css: string;
  cover: string;
  createdAt: string;
}

// Mock EPUB documents
const mockEPUBDocuments: EPUBDocument[] = [
  {
    id: 1,
    title: 'Bele noći',
    author: 'Fjodor Mihajlovič Dostojevski',
    epubPath: '/epub-output/bele-noci/Bele_noci.epub',
    chapters: [
      '/epub-output/bele-noci/OEBPS/Text/Jutro.xhtml',
      '/epub-output/bele-noci/OEBPS/Text/Naslov.xhtml',
      '/epub-output/bele-noci/OEBPS/Text/Nastjenjkina_istorija.xhtml',
      '/epub-output/bele-noci/OEBPS/Text/Noc_cetvrta.xhtml',
      '/epub-output/bele-noci/OEBPS/Text/Noc_druga.xhtml',
      '/epub-output/bele-noci/OEBPS/Text/Noc_prva.xhtml',
      '/epub-output/bele-noci/OEBPS/Text/Noc_treca.xhtml',
      '/epub-output/bele-noci/OEBPS/Text/cover.xhtml',
    ],
    css: '/epub-output/bele-noci/OEBPS/Styles/book.css',
    cover: '/epub-output/bele-noci/OEBPS/Images/cover.jpg',
    createdAt: new Date().toISOString(),
  },
];

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

  // EPUB functions
  getEPUBDocuments: async (): Promise<EPUBDocument[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockEPUBDocuments;
  },

  getEPUBDocument: async (id: number): Promise<EPUBDocument> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    const document = mockEPUBDocuments.find((doc) => doc.id === id);
    if (!document) {
      throw new Error('Document not found');
    }
    return document;
  },
};
