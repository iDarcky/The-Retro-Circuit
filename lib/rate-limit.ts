import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { headers } from 'next/headers';

// Ensure the environment variables exist
const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

if (!redisUrl || !redisToken) {
  console.warn('Rate limiting is disabled because KV_REST_API_URL or KV_REST_API_TOKEN is not defined in the environment.');
}

// Initialize Redis client explicitly with the Vercel KV env vars
export const redis = new Redis({
  url: redisUrl || '',
  token: redisToken || '',
});

/**
 * Standard search rate limiter: 20 requests per 10 seconds.
 * Allows quick typing for live search while preventing spam.
 */
export const searchRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '10 s'),
  analytics: true,
  prefix: 'ratelimit:search',
});

/**
 * Form submission rate limiter: 5 requests per 1 minute.
 * Good default for things like reviews, contact forms, etc.
 */
export const formRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  analytics: true,
  prefix: 'ratelimit:form',
});

/**
 * Extracts the user's IP address from headers, falling back to 'anonymous'
 * if not found. Next.js App Router exposes headers() in server actions/components.
 */
export const getIp = async (): Promise<string> => {
  const headersList = await headers();
  // Vercel routes traffic through a proxy, the original IP is in x-forwarded-for
  const forwardedFor = headersList.get('x-forwarded-for');
  const realIp = headersList.get('x-real-ip');

  if (forwardedFor) {
    // If there's a comma-separated list, take the first one
    return forwardedFor.split(',')[0].trim();
  }

  if (realIp) {
    return realIp.trim();
  }

  // Fallback if local or headers not present
  return 'anonymous';
};
