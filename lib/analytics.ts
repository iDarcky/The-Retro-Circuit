import posthog from 'posthog-js';
import { track as vercelTrack } from '@vercel/analytics';

type Props = Record<string, string | number | boolean | null | undefined>;

export function track(event: string, props?: Props) {
  try {
    vercelTrack(event, props as any);
  } catch {}
  try {
    if (typeof window !== 'undefined' && posthog.__loaded) {
      posthog.capture(event, props as any);
    }
  } catch {}
}
