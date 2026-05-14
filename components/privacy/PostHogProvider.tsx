'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';
import { useConsent } from './ConsentContext';

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com';

function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!posthog.__loaded) return;
    const query = searchParams.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    posthog.capture('$pageview', { $current_url: window.location.origin + url });
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider() {
  const { consent } = useConsent();

  useEffect(() => {
    if (consent !== true) return;
    if (!POSTHOG_KEY) return;
    if (posthog.__loaded) return;

    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: false,
      capture_pageleave: true,
      person_profiles: 'identified_only',
      autocapture: true,
    });
  }, [consent]);

  if (consent !== true) return null;

  return (
    <Suspense fallback={null}>
      <PageviewTracker />
    </Suspense>
  );
}
