
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title: string;
  description: string;
  type?: 'website' | 'article' | 'product';
  image?: string;
  structuredData?: Record<string, any>; // JSON-LD Schema
}

const SEOHead: React.FC<SEOHeadProps> = ({ title, description, type = 'website', image, structuredData }) => {
  const location = useLocation();
  const canonicalUrl = `https://theretrocircuit.com${location.pathname}`;
  const defaultImage = 'https://theretrocircuit.com/og-image.jpg'; // You should upload a default social share image to your public folder

  useEffect(() => {
    // 1. Update Title
    document.title = `${title} | The Retro Circuit`;

    // 2. Helper to safely update or create meta tags
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

    // 3. Standard Meta Tags
    updateMeta('meta[name="description"]', 'content', description, 'name', 'description');
    
    // 4. Open Graph (Facebook/Discord/LinkedIn)
    updateMeta('meta[property="og:title"]', 'content', title, 'property', 'og:title');
    updateMeta('meta[property="og:description"]', 'content', description, 'property', 'og:description');
    updateMeta('meta[property="og:type"]', 'content', type, 'property', 'og:type');
    updateMeta('meta[property="og:url"]', 'content', canonicalUrl, 'property', 'og:url');
    updateMeta('meta[property="og:image"]', 'content', image || defaultImage, 'property', 'og:image');

    // 5. Twitter Card
    updateMeta('meta[name="twitter:card"]', 'content', 'summary_large_image', 'name', 'twitter:card');
    updateMeta('meta[name="twitter:title"]', 'content', title, 'name', 'twitter:title');
    updateMeta('meta[name="twitter:description"]', 'content', description, 'name', 'twitter:description');
    updateMeta('meta[name="twitter:image"]', 'content', image || defaultImage, 'name', 'twitter:image');

    // 6. Canonical Link
    let linkCanon = document.querySelector('link[rel="canonical"]');
    if (!linkCanon) {
      linkCanon = document.createElement('link');
      linkCanon.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanon);
    }
    linkCanon.setAttribute('href', canonicalUrl);

    // 7. JSON-LD Structured Data (The "Secret Weapon" for Google)
    // Remove old schema scripts to prevent duplicates on navigation
    const oldScripts = document.querySelectorAll('script[type="application/ld+json"]');
    oldScripts.forEach(script => script.remove());

    if (structuredData) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

  }, [title, description, type, image, structuredData, canonicalUrl]);

  return null;
};

export default SEOHead;
