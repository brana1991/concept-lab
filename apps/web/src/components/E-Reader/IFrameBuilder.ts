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
      }

      #reader > * {
        break-inside: avoid;
        page-break-inside: avoid;
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
