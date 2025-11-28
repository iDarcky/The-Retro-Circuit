
import { useEffect, type FC } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title: string;
  description: string;
  type?: 'website' | 'article' | 'product';
  image?: string;
  structuredData?: Record<string, any>; // JSON-LD Schema
}

const SEOHead: FC<SEOHeadProps> = ({ title, description, type = 'website', image, structuredData }) => {
  const location = useLocation();
  
  // Clean URL: Remove trailing slash to ensure consistency (e.g., /games/ and /games are treated as /games)
  const cleanPath = location.pathname.endsWith('/') && location.pathname.length > 1 
    ? location.pathname.slice(0, -1) 
    : location.pathname;
    
  const canonicalUrl = `https://theretrocircuit.com${cleanPath}`;
  const defaultImage = 'https://theretrocircuit.com/og-image.jpg';
  const siteName = 'The Retro Circuit';
  const fullTitle = `${title} | ${siteName}`;

  useEffect(() => {
    // 1. Update Document Title
    document.title = fullTitle;

    // 2. Helper to safely update or create meta tags
    const updateMeta = (nameAttr: string, nameVal: string, contentVal: string) => {
      let element = document.querySelector(`meta[${nameAttr}="${nameVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, nameVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentVal);
    };

    // 3. Standard Meta Tags
    updateMeta('name', 'description', description);
    
    // 4. Open Graph (Facebook/Discord/LinkedIn)
    updateMeta('property', 'og:title', fullTitle);
    updateMeta('property', 'og:description', description);
    updateMeta('property', 'og:type', type);
    updateMeta('property', 'og:url', canonicalUrl);
    updateMeta('property', 'og:image', image || defaultImage);
    updateMeta('property', 'og:site_name', siteName);

    // 5. Twitter Card
    updateMeta('name', 'twitter:card', 'summary_large_image');
    updateMeta('name', 'twitter:title', fullTitle);
    updateMeta('name', 'twitter:description', description);
    updateMeta('name', 'twitter:image', image || defaultImage);

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

  }, [fullTitle, description, type, image, structuredData, canonicalUrl]);

  return null;
};

export default SEOHead;
