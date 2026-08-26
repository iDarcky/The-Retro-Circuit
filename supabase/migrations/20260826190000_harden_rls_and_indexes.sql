-- Schema hardening: public read scope, function exposure, indexes, integrity.
--
-- 1. PUBLIC READ SCOPE  ── the important one
--    "Public Read Consoles" was USING (true), so the anon role could read every row,
--    including 140 unpublished drafts and 6 archived consoles. The anon key ships in the
--    client bundle by design, so the whole unreleased catalogue was retrievable from
--    /rest/v1/consoles by anyone. Filtering happened only in application code.
--    Admin reads now go through the cookie-aware client (see app/actions/consoles.ts),
--    so tightening this does not break the admin editor or preview.

drop policy if exists "Public Read Consoles" on public.consoles;
drop policy if exists "Enable read access for all users" on public.consoles;

create policy "consoles_public_read_published"
  on public.consoles for select
  to anon
  using (status = 'published');

-- Signed-in admins keep full read access; other signed-in users see published only.
create policy "consoles_authenticated_read"
  on public.consoles for select
  to authenticated
  using (
    status = 'published'
    or (select auth.uid()) in (select id from public.profiles where role = 'admin')
  );

-- Child tables leaked the same way: a variant row exposes an unpublished console's specs.
drop policy if exists "Public Read Variants" on public.console_variants;
create policy "variants_public_read_published"
  on public.console_variants for select
  to anon
  using (exists (
    select 1 from public.consoles c
    where c.id = console_variants.console_id and c.status = 'published'
  ));

create policy "variants_authenticated_read"
  on public.console_variants for select
  to authenticated
  using (
    (select auth.uid()) in (select id from public.profiles where role = 'admin')
    or exists (
      select 1 from public.consoles c
      where c.id = console_variants.console_id and c.status = 'published'
    )
  );

-- 2. FUNCTION EXPOSURE
--    These are SECURITY DEFINER and were callable over REST by anonymous users.
revoke execute on function public.is_admin() from anon, authenticated;
revoke execute on function public.rls_auto_enable() from anon, authenticated;
revoke execute on function public.rc_clone_variant_profiles() from anon, authenticated;
revoke execute on function public.handle_new_user() from anon, authenticated;

-- Pin search_path so a caller cannot shadow the tables these functions resolve.
alter function public.is_admin() set search_path = public, pg_temp;
alter function public.handle_new_user() set search_path = public, pg_temp;
alter function public.rls_auto_enable() set search_path = public, pg_temp;
alter function public.rc_clone_variant_profiles() set search_path = public, pg_temp;
alter function public.update_modified_column() set search_path = public, pg_temp;
alter function public.update_roadmap_updated_at() set search_path = public, pg_temp;
alter function public.search_consoles_global(term text) set search_path = public, pg_temp;

-- 3. INDEXES
--    Both foreign keys are traversed on essentially every page render.
create index if not exists console_variants_console_id_idx
  on public.console_variants (console_id);
create index if not exists consoles_manufacturer_id_idx
  on public.consoles (manufacturer_id);
create index if not exists reviews_console_id_idx
  on public.reviews (console_id);

-- The sitemap, listings and every public query filter on status.
create index if not exists consoles_status_idx
  on public.consoles (status);

-- 4. INTEGRITY
--    emulation_profiles and variant_input_profile are strictly 1:1 with a variant
--    (267 rows / 267 distinct variant_ids each). Nothing enforced that, so a retry or a
--    double-fired trigger could silently create a second profile row.
create unique index if not exists emulation_profiles_variant_id_key
  on public.emulation_profiles (variant_id);
create unique index if not exists variant_input_profile_variant_id_key
  on public.variant_input_profile (variant_id);

-- At most one default variant per console.
create unique index if not exists console_variants_one_default_per_console
  on public.console_variants (console_id) where is_default;
