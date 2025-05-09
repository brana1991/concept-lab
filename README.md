# Concept-Lab

Bits & Bricks – A collection of problem-solving concepts, experimental features, and technical deep dives. This repository showcases modular solutions and innovative approaches to real-world challenges, focusing on both small code snippets (bits) and larger architectural ideas (bricks).

## Features

- EPUB reader with support for:
  - Multiple book formats
  - Chapter navigation
  - Text highlighting
  - Notes and annotations
  - Responsive design
- Modern tech stack:
  - React with Vite for the frontend
  - Express.js for the API backend
  - PostgreSQL for data storage
  - TypeScript for type safety

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Docker (optional, for containerized deployment)

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/concept-lab.git
   cd concept-lab
   ```

2. Install dependencies:
   ```bash
   # Install root dependencies
   npm install

   # Install frontend dependencies
   cd apps/web
   npm install

   # Install backend dependencies
   cd ../api
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   # Database
   PGHOST=localhost
   PGUSER=postgres
   PGPASSWORD=postgres
   PGDATABASE=flipbook
   PGPORT=5432
   ```

4. Set up the database:
   ```bash
   # Create the database
   createdb flipbook
   ```

5. Start the development servers:
   ```bash
   # Start the Vite frontend
   cd apps/web
   npm run dev

   # In a separate terminal, start the API server
   cd apps/api
   npm run dev
   ```

The application should now be running at:
- Frontend: http://localhost:5173 (default Vite port)
- API: http://localhost:3000

## EPUB Processing

To process an EPUB file for use in the application:

1. Place your EPUB file in any accessible location
2. Run the preprocessing script:
   ```bash
   cd apps/api
   npm run preprocess-epub /path/to/your/book.epub
   ```

The script will:
- Extract the EPUB contents
- Process chapter files and add unique IDs to HTML elements
- Handle spaces and special characters in filenames
- Create a manifest file
- Store book metadata in the database

## Deployment

### Docker Deployment

1. Build the Docker images:
   ```bash
   docker-compose build
   ```

2. Start the containers:
   ```bash
   docker-compose up -d
   ```

### Manual Deployment

1. Build the production assets:
   ```bash
   # Build frontend
   cd apps/web
   npm run build

   # Build backend
   cd ../api
   npm run build
   ```

2. Start the production servers:
   ```bash
   # Start the frontend
   cd apps/web
   npm run preview

   # In a separate terminal, start the API server
   cd apps/api
   npm start
   ```

## Project Structure

```
concept-lab/
├── apps/
│   ├── api/              # Express.js API server
│   │   ├── src/
│   │   │   ├── epub/     # EPUB processing logic
│   │   │   └── ...
│   │   └── ...
│   └── web/              # React frontend (Vite)
│       ├── src/
│       │   ├── components/
│       │   └── ...
│       └── ...
└── ...
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
