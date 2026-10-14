"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "../../lib/supabase/client";

// Only the live site counts. Previews and localhost would inflate the numbers.
const PRODUCTION_HOSTS = new Set(["theretrocircuit.com", "www.theretrocircuit.com"]);

// Private pages are not traffic.
const IGNORED_PREFIXES = ["/admin", "/profile", "/login", "/design", "/unsubscribe"];

// document.referrer and the landing URL do not change on client-side navigation, so
// only the first view of a visit carries them. Later views would repeat the same source.
let isLandingView = true;

function deviceType(): "mobile" | "tablet" | "desktop" {
  const ua = navigator.userAgent;
  if (/iPad|Tablet/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))) return "tablet";
  if (/Mobi|iPhone|Android/i.test(ua)) return "mobile";
  return "desktop";
}

function externalReferrerHost(): string | null {
  if (!document.referrer) return null;
  try {
    const host = new URL(document.referrer).hostname;
    return PRODUCTION_HOSTS.has(host) ? null : host.slice(0, 200);
  } catch {
    return null;
  }
}

/**
 * First-party pageview counter, written to `page_views` in Supabase.
 *
 * Cookieless and anonymous (path, external referrer host, utm_source, device class),
 * so it runs regardless of cookie consent. Vercel Analytics stays in place behind the
 * banner; this exists because its numbers cannot be read through the API.
 *
 * Fire-and-forget: a failed insert is ignored so tracking can never break a page.
 */
export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || !PRODUCTION_HOSTS.has(window.location.hostname)) return;
    if (navigator.webdriver || /bot|crawl|spider|Headless/i.test(navigator.userAgent)) return;
    if (IGNORED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return;

    const landing = isLandingView;
    isLandingView = false;
    const utm = landing ? new URLSearchParams(window.location.search).get("utm_source") : null;

    void supabase
      .from("page_views")
      .insert({
        path: pathname.slice(0, 300),
        referrer_host: landing ? externalReferrerHost() : null,
        utm_source: utm ? utm.slice(0, 100) : null,
        device: deviceType(),
      })
      .then(() => undefined, () => undefined);
  }, [pathname]);

  return null;
}
