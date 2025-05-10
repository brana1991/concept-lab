export class IframeBuilder {
  private iframe: HTMLIFrameElement;
  private container: HTMLDivElement;

  constructor(container: HTMLDivElement) {
    this.container = container;
    this.iframe = window.document.createElement('iframe');

    this.initIframe();
  }

  private initIframe() {
    this.iframe.style.width = '100%';
    this.iframe.style.height = '100%';
    this.iframe.style.border = 'none';
    this.container.appendChild(this.iframe);

    if (!this.iframe.contentDocument) {
      throw new Error('Iframe contentDocument not available - iframe must be added to DOM first');
    }

    this.iframe.contentDocument.open();
    this.iframe.contentDocument.write('<!DOCTYPE html><html><head></head><body></body></html>');
    this.iframe.contentDocument.close();
  }

  injectPublisherStyles(cssPaths: string[]) {
    if (!this.iframe.contentDocument) {
      throw new Error('Iframe contentDocument not available - iframe must be added to DOM first');
    }

    const contentDocument = this.iframe.contentDocument;
    const existingLinks = Array.from(contentDocument.getElementsByTagName('link'));

    // Only inject CSS that isn't already present
    cssPaths.forEach((cssPath) => {
      const cssFilename = cssPath.split('/').pop() || '';
      const alreadyExists = existingLinks.some((link) => {
        const href = link.getAttribute('href') || '';
        return href.includes(cssFilename);
      });

      if (!alreadyExists) {
        const publisherCssLink = contentDocument.createElement('link');
        publisherCssLink.rel = 'stylesheet';
        publisherCssLink.href = cssPath;
        contentDocument.head.appendChild(publisherCssLink);
      }
    });

    return this;
  }

  injectCustomStyles() {
    if (!this.iframe.contentDocument) {
      throw new Error('Iframe contentDocument not available - iframe must be added to DOM first');
    }

    // load default.css
    const defaultCss = document.createElement('link');
    defaultCss.rel = 'stylesheet';
    defaultCss.href = '/themes/default.css';
    this.iframe.contentDocument.head.appendChild(defaultCss);

    return this;
  }

  copyHtmlToIframe(sourceDoc: Document) {
    if (!this.iframe.contentDocument) {
      throw new Error('Iframe contentDocument not available - iframe must be added to DOM first');
    }

    const contentDocument = this.iframe.contentDocument;

    const headContent = sourceDoc.querySelector('head');
    if (headContent) {
      Array.from(headContent.children).forEach((child) => {
        contentDocument.head.appendChild(child.cloneNode(true));
      });
    }

    const bodyContent = sourceDoc.querySelector('body');
    if (bodyContent) {
      contentDocument.body.innerHTML = bodyContent.innerHTML;
    }

    return this;
  }

  getIframe() {
    return this.iframe;
  }
}
