BEGIN;

-- Core tables for EPUB reader functionality
CREATE TABLE documents (
    id bigserial PRIMARY KEY,
    title text NOT NULL,
    author text,
    manifest_url text NOT NULL UNIQUE,
    total_chapters integer NOT NULL,
    uploaded_at timestamptz DEFAULT now()
);

CREATE TABLE chapters (
    id bigserial PRIMARY KEY,
    document_id bigint NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    idx integer NOT NULL,
    file_path text NOT NULL,
    title text,
    UNIQUE(document_id, idx)
);

CREATE TABLE highlights (
    id bigserial PRIMARY KEY,
    document_id bigint NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    chapter_id bigint NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    anchor_id text NOT NULL,
    start_offset integer NOT NULL,
    length integer NOT NULL,
    text text,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE notes (
    id bigserial PRIMARY KEY,
    highlight_id bigint NOT NULL REFERENCES highlights(id) ON DELETE CASCADE,
    content text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_chapters_document_id ON chapters(document_id);
CREATE INDEX idx_highlights_chapter_id ON highlights(chapter_id);
CREATE INDEX idx_highlights_document_id ON highlights(document_id);
CREATE INDEX idx_notes_highlight_id ON notes(highlight_id);

-- Table comments
COMMENT ON TABLE documents IS 'Stores metadata for uploaded EPUB documents';
COMMENT ON TABLE chapters IS 'Represents individual chapters/spine items within an EPUB document';
COMMENT ON TABLE highlights IS 'Stores user highlights with their position and text content';
COMMENT ON TABLE notes IS 'Stores user notes attached to highlights';

-- Column comments
COMMENT ON COLUMN documents.id IS 'Unique identifier for the document';
COMMENT ON COLUMN documents.title IS 'Title of the EPUB document';
COMMENT ON COLUMN documents.author IS 'Author of the EPUB document';
COMMENT ON COLUMN documents.manifest_url IS 'URL to the document''s manifest.json file';
COMMENT ON COLUMN documents.total_chapters IS 'Total number of chapters in the document';
COMMENT ON COLUMN documents.uploaded_at IS 'Timestamp when the document was uploaded';

COMMENT ON COLUMN chapters.id IS 'Unique identifier for the chapter';
COMMENT ON COLUMN chapters.document_id IS 'Reference to the parent document';
COMMENT ON COLUMN chapters.idx IS '0-based index of the chapter in the document''s spine';
COMMENT ON COLUMN chapters.file_path IS 'Path to the chapter''s XHTML file';
COMMENT ON COLUMN chapters.title IS 'Title of the chapter';

COMMENT ON COLUMN highlights.id IS 'Unique identifier for the highlight';
COMMENT ON COLUMN highlights.document_id IS 'Reference to the parent document';
COMMENT ON COLUMN highlights.chapter_id IS 'Reference to the chapter containing the highlight';
COMMENT ON COLUMN highlights.anchor_id IS 'ID of the paragraph/heading element in the XHTML';
COMMENT ON COLUMN highlights.start_offset IS 'Starting character offset within the anchor element';
COMMENT ON COLUMN highlights.length IS 'Length of the highlighted text in characters';
COMMENT ON COLUMN highlights.text IS 'Cached text content of the highlight';
COMMENT ON COLUMN highlights.created_at IS 'Timestamp when the highlight was created';

COMMENT ON COLUMN notes.id IS 'Unique identifier for the note';
COMMENT ON COLUMN notes.highlight_id IS 'Reference to the associated highlight';
COMMENT ON COLUMN notes.content IS 'Text content of the note';
COMMENT ON COLUMN notes.created_at IS 'Timestamp when the note was created';

COMMIT; 