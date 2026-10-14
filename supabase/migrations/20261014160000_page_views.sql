-- First-party pageview counter.
--
-- Vercel Web Analytics is on, but its query API returns 404 for this project, so its
-- numbers can only be read in the dashboard. This table gives the growth test a source
-- Claude can query directly.
--
-- Cookieless and anonymous: no IP, no visitor id, no query string. That is why the
-- tracker does not wait on the cookie banner, unlike Vercel Analytics.
--
-- The browser inserts with the anon key. Anon may INSERT but never SELECT, so the
-- table is write-only from the public site; reads happen through the service role.
-- The CHECKs cap what a hand-crafted request can stuff into a row.
--
-- Additive only. Nothing existing is touched.

CREATE TABLE public.page_views (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at    timestamptz NOT NULL DEFAULT now(),
  path          text NOT NULL CHECK (char_length(path) BETWEEN 1 AND 300 AND left(path, 1) = '/'),
  referrer_host text CHECK (char_length(referrer_host) <= 200),
  utm_source    text CHECK (char_length(utm_source) <= 100),
  device        text CHECK (device IN ('mobile', 'tablet', 'desktop'))
);

CREATE INDEX page_views_created_at_idx ON public.page_views (created_at);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY page_views_insert_public
  ON public.page_views
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

GRANT INSERT ON public.page_views TO anon, authenticated;
REVOKE SELECT, UPDATE, DELETE ON public.page_views FROM anon, authenticated;
