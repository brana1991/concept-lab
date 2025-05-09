const API_BASE_URL = 'http://localhost:3000/api';
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

// Mock EPUB documents
const mockEPUBDocuments: EPUBDocument[] = [
  {
    id: 1,
    title: 'Bele noći',
    author: 'Fjodor Mihajlovič Dostojevski',
    epubPath: `${STATIC_BASE_URL}/epub/bele-noci/manifest.json`,
    chapters: [
      `${STATIC_BASE_URL}/epub/bele-noci/OEBPS/Text/cover.xhtml`,
      `${STATIC_BASE_URL}/epub/bele-noci/OEBPS/Text/Jutro.xhtml`,
      `${STATIC_BASE_URL}/epub/bele-noci/OEBPS/Text/Naslov.xhtml`,
      `${STATIC_BASE_URL}/epub/bele-noci/OEBPS/Text/Nastjenjkina_istorija.xhtml`,
      `${STATIC_BASE_URL}/epub/bele-noci/OEBPS/Text/Noc_cetvrta.xhtml`,
      `${STATIC_BASE_URL}/epub/bele-noci/OEBPS/Text/Noc_druga.xhtml`,
      `${STATIC_BASE_URL}/epub/bele-noci/OEBPS/Text/Noc_prva.xhtml`,
      `${STATIC_BASE_URL}/epub/bele-noci/OEBPS/Text/Noc_treca.xhtml`,
    ],
    css: [`${STATIC_BASE_URL}/epub/bele-noci/OEBPS/Styles/style.css`],
    cover: `${STATIC_BASE_URL}/epub/bele-noci/OEBPS/Images/cover.jpg`,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Gospodar muva',
    author: 'Vilijem Golding',
    epubPath: `${STATIC_BASE_URL}/epub/gospodar-muha/manifest.json`,
    chapters: [
      `${STATIC_BASE_URL}/epub/gospodar-muha/OEBPS/Text/001.html`,
      `${STATIC_BASE_URL}/epub/gospodar-muha/OEBPS/Text/002.html`,
      `${STATIC_BASE_URL}/epub/gospodar-muha/OEBPS/Text/003.html`,
      `${STATIC_BASE_URL}/epub/gospodar-muha/OEBPS/Text/004.html`,
      `${STATIC_BASE_URL}/epub/gospodar-muha/OEBPS/Text/005.html`,
      `${STATIC_BASE_URL}/epub/gospodar-muha/OEBPS/Text/006.html`,
      `${STATIC_BASE_URL}/epub/gospodar-muha/OEBPS/Text/007.html`,
      `${STATIC_BASE_URL}/epub/gospodar-muha/OEBPS/Text/008.html`,
      `${STATIC_BASE_URL}/epub/gospodar-muha/OEBPS/Text/009.html`,
      `${STATIC_BASE_URL}/epub/gospodar-muha/OEBPS/Text/010.html`,
      `${STATIC_BASE_URL}/epub/gospodar-muha/OEBPS/Text/011.html`,
      `${STATIC_BASE_URL}/epub/gospodar-muha/OEBPS/Text/012.html`,
      `${STATIC_BASE_URL}/epub/gospodar-muha/OEBPS/Text/013.html`,
      `${STATIC_BASE_URL}/epub/gospodar-muha/OEBPS/Text/014.html`,
      `${STATIC_BASE_URL}/epub/gospodar-muha/OEBPS/Text/015.html`,
      `${STATIC_BASE_URL}/epub/gospodar-muha/OEBPS/Text/016.html`,
      `${STATIC_BASE_URL}/epub/gospodar-muha/OEBPS/Text/notes.html`,
    ],
    css: [`${STATIC_BASE_URL}/epub/gospodar-muha/OEBPS/Styles/style.css`],
    cover: `${STATIC_BASE_URL}/epub/gospodar-muha/OEBPS/Images/cover.jpg`,
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

  getEPUBDocuments: async (): Promise<EPUBDocument[]> => {
    const response = await fetch(`${API_BASE_URL}/epub/documents`);
    if (!response.ok) throw new Error('Failed to fetch documents');
    return response.json();
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
