# PDF Rasterizer and OCR Pipeline

This project provides a complete solution for converting PDFs into WebP images with OCR data, storing the results in a PostgreSQL database, and displaying them in a React-based flipbook viewer.

## Features

- Converts PDF pages to WebP images at 144dpi and 288dpi
- Extracts text and bounding boxes using Tesseract OCR
- Normalizes bounding box coordinates for responsive display
- Stores images and OCR data in PostgreSQL for persistence
- Provides a REST API for accessing documents and pages
- Includes a React component for displaying flipbook-style PDFs

## System Architecture

The system consists of three main components:

1. **PDF Converter** - Docker container that processes PDFs and stores data in PostgreSQL
2. **API Server** - Express.js server that provides endpoints for accessing the processed data
3. **React Component** - Frontend component for displaying documents with page-flipping animations

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- A PDF file for testing

### Setup

1. Clone this repository
2. Place a PDF file in the `sample` directory (e.g., `sample/1984.pdf`)
3. Build and start the services:

```bash
docker compose up -d postgres
docker compose up pdf-converter
docker compose up -d api-server
```

### Converting PDFs

The PDF converter will automatically process the file at `/input/1984.pdf` (from the `sample` directory). You can also specify a different file:

```bash
docker compose run pdf-converter /input/your-file.pdf
```

The converter will:

1. Rasterize each page to PNG at 144dpi and 288dpi
2. Convert the PNGs to WebP format
3. Perform OCR to extract text and bounding boxes
4. Store everything in the PostgreSQL database
5. Output the document ID for later reference

### API Endpoints

The API server runs on port 3000 and provides the following endpoints:

- `GET /api/documents` - List all documents
- `GET /api/documents/:id` - Get document metadata
- `GET /api/documents/:id/pages/:pageNumber/metadata` - Get page metadata
- `GET /api/documents/:id/pages/:pageNumber/image-low` - Get low-resolution (144dpi) image
- `GET /api/documents/:id/pages/:pageNumber/image-high` - Get high-resolution (288dpi) image
- `GET /api/documents/:id/pages/:pageNumber/ocr` - Get OCR data for a page

### Using the React Component

To use the FlipBook component in your React application:

1. Copy `FlipBookClient.jsx` and `FlipBook.css` to your project
2. Update the `API_URL` constant if your API server is at a different location
3. Use the component in your app:

```jsx
import FlipBook from './FlipBookClient';

function App() {
  return (
    <div className="App">
      <FlipBook documentId="your-document-id" />
    </div>
  );
}
```

Replace `your-document-id` with the ID provided by the PDF converter.

## Development

### Local Development

For local development of the React component:

1. Install dependencies: `npm install`
2. Start the API server: `npm run api`
3. Integrate the FlipBook component in your React application

### Customization

- Modify `convert.mjs` to change PDF processing options
- Adjust `api-server.mjs` to add new endpoints or features
- Customize `FlipBookClient.jsx` and `FlipBook.css` to change the appearance and behavior of the flipbook

## Troubleshooting

- If the PDF converter fails, check the Docker logs for error messages
- Ensure your PostgreSQL instance is running before starting the converter or API server
- For image quality issues, you can adjust the DPI settings in `convert.mjs`

## License

This project is licensed under the MIT License - see the LICENSE file for details.
