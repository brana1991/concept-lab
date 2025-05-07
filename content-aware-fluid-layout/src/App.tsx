import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PDFViewer } from './components/PDFViewer';
import { useDocuments } from './lib/queries';
import './App.scss';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Document selector component
const DocumentSelector = ({ onSelect }: { onSelect: (id: number) => void }) => {
  const { data: documents, isLoading } = useDocuments();

  if (isLoading) return <div>Loading documents...</div>;
  if (!documents || documents.length === 0) return <div>No documents available</div>;

  return (
    <div className="document-selector">
      <label>Select Document: </label>
      <select onChange={(e) => onSelect(Number(e.target.value))}>
        {documents.map((doc) => (
          <option key={doc.id} value={doc.id}>
            {doc.filename}
          </option>
        ))}
      </select>
    </div>
  );
};

// Main App component
function App() {
  const [documentId, setDocumentId] = useState(1); // Default to first document

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app-container">
        <DocumentSelector onSelect={setDocumentId} />
        <PDFViewer documentId={documentId} />
      </div>
    </QueryClientProvider>
  );
}

export default App;
