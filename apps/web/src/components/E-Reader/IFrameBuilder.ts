export class IframeBuilder {
  private iframe: HTMLIFrameElement;
  private styles: string[] = [];

  constructor(iframe: HTMLIFrameElement) {
    this.iframe = iframe;
    this.initIframe();
  }

  private initIframe() {
    if (!this.iframe.contentDocument) {
      throw new Error('No contentDocument available');
    }

    // Initialize iframe document
    this.iframe.contentDocument.open();
    this.iframe.contentDocument.write('<!DOCTYPE html><html><head></head><body></body></html>');
    this.iframe.contentDocument.close();
  }

  copyHtmlToIframe(doc: Document): IframeBuilder {
    if (!this.iframe.contentDocument) {
      throw new Error('No contentDocument available');
    }

    // Create reader wrapper
    const reader = this.iframe.contentDocument.createElement('div');
    reader.id = 'reader';

    // Move all content into the reader
    while (doc.body.firstChild) {
      reader.appendChild(doc.body.firstChild);
    }
    doc.body.appendChild(reader);

    // Copy the entire document
    this.iframe.contentDocument.documentElement.innerHTML = doc.documentElement.innerHTML;

    return this;
  }

  injectPublisherStyles(cssFiles: string[]): IframeBuilder {
    this.styles = [...this.styles, ...cssFiles];
    return this;
  }

  injectCustomStyles(): IframeBuilder {
    const customStyles = `
      html, body {
        margin: 0;
        height: 100vh;
        overflow: hidden;
        touch-action: pan-x;
        -webkit-text-size-adjust: none;
        text-size-adjust: none;
      }

      #reader {
        height: 100%;
        width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        columns: 100vw auto;
        column-gap: 0;
        background-color: #fafafa;
        color: #2c3e50;
        font-family: 'Literata', Georgia, serif;
        line-height: 1.6;
        font-size: 1rem!important;
      }

      #reader > * {
        word-wrap: break-word;
        word-break: break-word;
        overflow-wrap: break-word;
        hyphens: auto;
        padding:0 16px;
      }

      /* Allow paragraphs to break across columns */
      #reader p {
        break-inside: auto;
        page-break-inside: auto;
        margin: 0 0 0.15rem;
        text-align: justify;
      }

      /* Keep other elements from breaking */
      #reader h1, #reader h2, #reader h3, #reader h4, #reader h5, #reader h6,
      #reader img, #reader pre, #reader blockquote, #reader table {
        break-inside: avoid;
        page-break-inside: avoid;
      }

      /* Typography styles */
      #reader h1, #reader h2, #reader h3, #reader h4, #reader h5, #reader h6 {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        font-weight: 600;
        line-height: 1.3;
        margin: 1.5rem 0 0.75rem;
        color: #1a202c;
      }

      #reader h1 { font-size: 1.75rem; }
      #reader h2 { font-size: 1.5rem; }
      #reader h3 { font-size: 1.25rem; }
      #reader h4 { font-size: 1.125rem; }
      #reader h5 { font-size: 1rem; }
      #reader h6 { font-size: 0.875rem; }

      #reader blockquote {
        margin: 1.5rem 0;
        padding: 1rem 1.5rem;
        border-left: 3px solid #e2e8f0;
        font-style: italic;
        color: #4a5568;
        background-color: #f8fafc;
        border-radius: 0 6px 6px 0;
      }

      #reader code {
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
        font-size: 0.875em;
        padding: 0.15em 0.3em;
        background-color: #f1f5f9;
        border-radius: 3px;
        color: #2d3748;
      }

      #reader pre {
        background-color: #1a202c;
        padding: 1rem;
        border-radius: 6px;
        overflow-x: auto;
        margin: 1rem 0;
      }

      #reader pre code {
        padding: 0;
        background-color: transparent;
        color: #e2e8f0;
      }

      #reader img {
        max-width: 100%;
        height: auto;
        display: block;
        margin: 1.5rem auto;
        border-radius: 6px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      #reader a {
        color: #3182ce;
        text-decoration: none;
        border-bottom: 1px solid transparent;
        transition: all 0.2s ease;
      }

      #reader a:hover {
        color: #2c5282;
        border-bottom-color: #2c5282;
      }

      #reader ul, #reader ol {
        margin: 1rem 0;
        padding-left: 1.5rem;
      }

      #reader li {
        margin-bottom: 0.5rem;
      }

      #reader table {
        width: 100%;
        border-collapse: collapse;
        margin: 1.5rem 0;
        background-color: white;
        border-radius: 6px;
        overflow: hidden;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }

      #reader th, #reader td {
        padding: 0.75rem;
        border: 1px solid #e2e8f0;
      }

      #reader th {
        background-color: #f8fafc;
        font-weight: 600;
        color: #2d3748;
      }

      #reader tr:nth-child(even) {
        background-color: #f8fafc;
      }

      ::-webkit-scrollbar {
        display: none;
      }

      img, video {
        max-width: 100%;
        display: block;
        margin: 1em auto;
      }

      pre, code {
        white-space: pre-wrap;
        overflow-x: auto;
      }

      * {
        orphans: 2;
        widows: 2;
        box-sizing: border-box;
      }

      /* Add font imports */
      @import url('https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,500;0,7..72,600;1,7..72,400&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');
    `;

    this.styles.push(`data:text/css;base64,${btoa(customStyles)}`);
    return this;
  }

  async build(): Promise<void> {
    if (!this.iframe.contentDocument) {
      throw new Error('No contentDocument available');
    }

    // Inject all styles
    for (const style of this.styles) {
      const link = this.iframe.contentDocument.createElement('link');
      link.rel = 'stylesheet';
      link.href = style;
      this.iframe.contentDocument.head.appendChild(link);
    }

    // Wait for styles to load
    await Promise.all(
      Array.from(this.iframe.contentDocument.getElementsByTagName('link')).map(
        (link) =>
          new Promise((resolve) => {
            if (link.sheet) {
              resolve(null);
            } else {
              link.onload = () => resolve(null);
            }
          }),
      ),
    );
  }
}
