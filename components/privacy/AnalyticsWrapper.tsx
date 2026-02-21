"use client";

import { Analytics } from "@vercel/analytics/react";
import { useConsent } from "./ConsentContext";

export function AnalyticsWrapper() {
  const { consent } = useConsent();

  // Strict blocking: Only load if consent is explicitly true
  if (consent !== true) {
    return null;
  }

  return <Analytics />;
}
