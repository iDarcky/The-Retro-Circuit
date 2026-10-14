-- APPLIED 2026-10-14 via the Supabase MCP, as six migrations (revoke_rpc_on_internal_functions,
-- profiles_update_own_only, profiles_role_not_user_editable, catalogue_writes_admin_only,
-- content_writes_admin_only). The live version uses ALTER POLICY on the existing policy names
-- instead of drop + create, so policy names differ from the ones below; the rules are the same.
--
-- 2026-10-14 security pass. Today several policies let ANY signed-in user (and on
-- emulation_profiles, anyone at all, signed in or not) write the catalogue, and the
-- profiles UPDATE policy lets a user set their own profiles.role to 'admin'.
-- The admin is recognised by profiles.role = 'admin', the same rule middleware.ts uses.
-- Admin writes go through the signed-in server client, so they keep working; triggers and
-- FK cascades run as the table owner and are unaffected.

-- 1. Nobody may promote themselves: users keep UPDATE on their profile except `role`.
revoke update on public.profiles from anon, authenticated;
do $$
declare cols text;
begin
  select string_agg(quote_ident(column_name), ', ') into cols
  from information_schema.columns
  where table_schema = 'public' and table_name = 'profiles' and column_name not in ('id', 'role');
  if cols is not null then
    execute format('grant update (%s) on public.profiles to authenticated', cols);
  end if;
end $$;
drop policy if exists "Users can update own profile." on public.profiles;
create policy "Users can update own profile." on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- 2. Catalogue tables: replace "any signed-in user" with "admin".
drop policy if exists "Admin Write Consoles" on public.consoles;
drop policy if exists "Enable write access for admins" on public.consoles;
create policy "consoles admin write" on public.consoles for all to authenticated
  using ((select auth.uid()) in (select id from public.profiles where role = 'admin'))
  with check ((select auth.uid()) in (select id from public.profiles where role = 'admin'));

drop policy if exists "Admin Write Variants" on public.console_variants;
create policy "variants admin write" on public.console_variants for all to authenticated
  using ((select auth.uid()) in (select id from public.profiles where role = 'admin'))
  with check ((select auth.uid()) in (select id from public.profiles where role = 'admin'));

drop policy if exists "Admin Full Access" on public.manufacturer;
create policy "manufacturer admin write" on public.manufacturer for all to authenticated
  using ((select auth.uid()) in (select id from public.profiles where role = 'admin'))
  with check ((select auth.uid()) in (select id from public.profiles where role = 'admin'));

drop policy if exists "Admins can insert profiles" on public.emulation_profiles;
drop policy if exists "Admins can update profiles" on public.emulation_profiles;
create policy "emulation admin insert" on public.emulation_profiles for insert to authenticated
  with check ((select auth.uid()) in (select id from public.profiles where role = 'admin'));
create policy "emulation admin update" on public.emulation_profiles for update to authenticated
  using ((select auth.uid()) in (select id from public.profiles where role = 'admin'))
  with check ((select auth.uid()) in (select id from public.profiles where role = 'admin'));

drop policy if exists "Enable insert for authenticated users only" on public.variant_input_profile;
drop policy if exists "Enable update for owners/admins" on public.variant_input_profile;
create policy "input profile admin insert" on public.variant_input_profile for insert to authenticated
  with check ((select auth.uid()) in (select id from public.profiles where role = 'admin'));
create policy "input profile admin update" on public.variant_input_profile for update to authenticated
  using ((select auth.uid()) in (select id from public.profiles where role = 'admin'))
  with check ((select auth.uid()) in (select id from public.profiles where role = 'admin'));

-- 3. Content tables that said "any signed-in user may manage".
drop policy if exists "Admins can manage reviews" on public.reviews;
create policy "Admins can manage reviews" on public.reviews for all to authenticated
  using ((select auth.uid()) in (select id from public.profiles where role = 'admin'))
  with check ((select auth.uid()) in (select id from public.profiles where role = 'admin'));
drop policy if exists "Admins can manage signals" on public.signals;
create policy "Admins can manage signals" on public.signals for all to authenticated
  using ((select auth.uid()) in (select id from public.profiles where role = 'admin'))
  with check ((select auth.uid()) in (select id from public.profiles where role = 'admin'));
drop policy if exists "Admins can manage news" on public.news;
create policy "Admins can manage news" on public.news for all to authenticated
  using ((select auth.uid()) in (select id from public.profiles where role = 'admin'))
  with check ((select auth.uid()) in (select id from public.profiles where role = 'admin'));
drop policy if exists "Admins can manage guides" on public.guides;
create policy "Admins can manage guides" on public.guides for all to authenticated
  using ((select auth.uid()) in (select id from public.profiles where role = 'admin'))
  with check ((select auth.uid()) in (select id from public.profiles where role = 'admin'));

-- 4. Already admin-only; re-written only so auth.uid() is evaluated once per query.
drop policy if exists "Admins can manage roadmap items" on public.roadmap_features;
create policy "Admins can manage roadmap items" on public.roadmap_features for all to authenticated
  using ((select auth.uid()) in (select id from public.profiles where role = 'admin'))
  with check ((select auth.uid()) in (select id from public.profiles where role = 'admin'));
drop policy if exists "Admins can manage releases" on public.releases;
create policy "Admins can manage releases" on public.releases for all to authenticated
  using ((select auth.uid()) in (select id from public.profiles where role = 'admin'))
  with check ((select auth.uid()) in (select id from public.profiles where role = 'admin'));
drop policy if exists "Public can view published releases" on public.releases;
create policy "Public can view published releases" on public.releases for select
  using (is_published = true or (select auth.uid()) in (select id from public.profiles where role = 'admin'));
drop policy if exists "console_images admin write" on public.console_images;
create policy "console_images admin write" on public.console_images for all to authenticated
  using ((select auth.uid()) in (select id from public.profiles where role = 'admin'))
  with check ((select auth.uid()) in (select id from public.profiles where role = 'admin'));

-- 5. Internal functions should not be callable through /rest/v1/rpc. Trigger and event-
-- trigger functions do not need EXECUTE at run time. is_admin() reads public.admins,
-- which does not exist, and no policy or code calls it.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.rc_clone_variant_profiles() from public, anon, authenticated;
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
revoke execute on function public.is_admin() from public, anon, authenticated;
