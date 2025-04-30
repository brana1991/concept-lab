import React, { useState } from 'react';

interface UploadScreenProps {
  onFileUpload: (file: File) => void;
}

const UploadScreen: React.FC<UploadScreenProps> = ({ onFileUpload }) => {
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'application/pdf' || file.type === 'application/epub+zip')) {
      setError(null);
      onFileUpload(file);
    } else {
      setError('Please upload a valid PDF or EPUB file.');
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && (file.type === 'application/pdf' || file.type === 'application/epub+zip')) {
      setError(null);
      onFileUpload(file);
    } else {
      setError('Please upload a valid PDF or EPUB file.');
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="upload-screen">
      <div className="drop-zone" onDrop={handleDrop} onDragOver={handleDragOver}>
        <p>Drag and drop a file here, or click to select a file</p>
        <input type="file" accept=".pdf,.epub" onChange={handleFileChange} />
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default UploadScreen;
