import { siteConfig } from '../config/site';

/* Crawlers that copy pages to train AI models and never send a visitor back.
 *
 * AI *search* bots are deliberately not listed (OAI-SearchBot, ChatGPT-User, PerplexityBot,
 * Perplexity-User, Claude-SearchBot, Claude-User): they are how ChatGPT, Perplexity and
 * Claude link to the site, and they send real referrals. Gemini answers come from
 * Googlebot, which stays allowed (Google-Extended is left alone too: it governs Gemini grounding and crawls nothing, so it would cost referrals and save no reads). Blocking these trainers also trims ISR reads, since
 * they crawl the long tail of comparison and console pages nobody else requests. */
const AI_TRAINING_CRAWLERS = [
  'GPTBot',
  'ClaudeBot',
  'CCBot',
  'Bytespider',
  'meta-externalagent',
  'Amazonbot',
  'cohere-training-data-crawler',
  'Diffbot',
  'omgilibot',
  'Timpibot',
  'ImagesiftBot',
];

export default function robots() {
  const baseUrl = siteConfig.url;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/design', '/login', '/profile'],
      },
      {
        userAgent: AI_TRAINING_CRAWLERS,
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
