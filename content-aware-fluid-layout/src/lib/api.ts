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
};
