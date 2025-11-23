
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

    // Helper to update meta tags
    const updateMeta = (name: string, content: string, attribute = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update Standard Meta
    updateMeta('description', description);

    // Update Open Graph (Social Media)
    updateMeta('og:title', `The Retro Circuit - ${title}`, 'property');
    updateMeta('og:description', description, 'property');
    updateMeta('og:type', type, 'property');
    updateMeta('og:site_name', 'The Retro Circuit', 'property');

    // Cleanup isn't strictly necessary for a simple SPA, 
    // but good practice if we were unmounting to a non-SEO state.
  }, [title, description, type]);

  return null;
};

export default SEOHead;
