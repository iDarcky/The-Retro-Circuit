export default function robots() {
  const baseUrl = 'https://theretrocircuit.com';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'CCBot', 'Google-Extended', 'AnthropicAI', 'Claude-Web', 'Omgilibot', 'FacebookBot'],
        disallow: '/',
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
