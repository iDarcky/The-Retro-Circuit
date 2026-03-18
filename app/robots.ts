export default function robots() {
  const baseUrl = 'https://theretrocircuit.com';
  
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
