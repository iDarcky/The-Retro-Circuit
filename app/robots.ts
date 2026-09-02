import { siteConfig } from '../config/site';

export default function robots() {
  const baseUrl = siteConfig.url;
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/design', '/login', '/profile'],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
