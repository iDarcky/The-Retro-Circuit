-- Fix over-permissive write policies on news, reviews, and signals.
--
-- Before: "FOR ALL USING (auth.role() = 'authenticated')" allowed ANY logged-in user
-- to insert/update/delete these rows. We tighten them to admins only, matching the
-- pattern already used by the consoles table (20240605000000_secure_consoles.sql).
--
-- Public SELECT policies are intentionally left untouched (news/reviews are public;
-- signals expose only is_active = true to anon).
--
-- NOTE: Back up the database before applying (project HARD RULE).

-- ── news ──
DROP POLICY IF EXISTS "Admins can manage news" ON news;
CREATE POLICY "Admins can manage news" ON news
    FOR ALL
    USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'))
    WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- ── reviews ──
DROP POLICY IF EXISTS "Admins can manage reviews" ON reviews;
CREATE POLICY "Admins can manage reviews" ON reviews
    FOR ALL
    USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'))
    WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- ── signals ──
DROP POLICY IF EXISTS "Admins can manage signals" ON signals;
CREATE POLICY "Admins can manage signals" ON signals
    FOR ALL
    USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'))
    WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));
