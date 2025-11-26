
import React, { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  type?: 'website' | 'article';
}

const SEOHead: React.FC<SEOHeadProps> = ({ title, description, type = 'website' }) => {
  useEffect(() => {
    // Update Title
    document.title = `THE RETRO CIRCUIT | ${title}`;

    // Helper to safely update or create meta tags
    const updateMeta = (selector: string, attribute: string, value: string, createKey?: string, createVal?: string) => {
      let element = document.querySelector(selector);
      if (!element && createKey && createVal) {
        element = document.createElement('meta');
        element.setAttribute(createKey, createVal);
        document.head.appendChild(element);
      }
      if (element) {
        element.setAttribute(attribute, value);
      }
    };

    updateMeta('meta[name="description"]', 'content', description, 'name', 'description');
    updateMeta('meta[property="og:title"]', 'content', `The Retro Circuit - ${title}`, 'property', 'og:title');
    updateMeta('meta[property="og:description"]', 'content', description, 'property', 'og:description');
    updateMeta('meta[property="og:type"]', 'content', type, 'property', 'og:type');

  }, [title, description, type]);

  return null;
};

export default SEOHead;
