// Common types used across the application
export interface Document {
  id: string;
  title: string;
  type: 'pdf' | 'epub';
  createdAt: string;
  updatedAt: string;
}

export interface ProcessingStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  error?: string;
} 