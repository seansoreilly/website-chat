import { ScrapedData } from '../types';

export const scrapeWebsite = async (url: string): Promise<ScrapedData> => {
  try {
    // Using a common CORS proxy for client-side demos. 
    // In production, this should be a dedicated backend.
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(proxyUrl);
    const data = await response.json();
    
    if (!data.contents) {
      throw new Error("No content returned from proxy");
    }

    // Parse HTML to extract text
    const parser = new DOMParser();
    const doc = parser.parseFromString(data.contents, 'text/html');

    // Remove scripts, styles, and other non-content elements
    const scripts = doc.querySelectorAll('script, style, noscript, iframe, svg');
    scripts.forEach(script => script.remove());

    const title = doc.title || url;
    const bodyText = doc.body.innerText || "";
    
    // Clean up whitespace
    const cleanText = bodyText.replace(/\s+/g, ' ').trim().substring(0, 20000); // Limit context size

    return {
      url,
      content: cleanText,
      title,
      success: true
    };

  } catch (error) {
    console.warn("Scraping failed, falling back to Search Grounding:", error);
    return {
      url,
      content: "",
      title: url,
      success: false // Indicates we should rely on the model's search tool
    };
  }
};
