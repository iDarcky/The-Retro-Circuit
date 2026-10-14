-- APPLIED 2026-10-14 via the Supabase MCP.
-- Snapshot of every table the 2026-10-14 cleanup touches. Not exposed through the API
-- (only `public` is). Drop the schema once the changes have been live for a release or two.
create schema if not exists backup_20261014;
revoke all on schema backup_20261014 from anon, authenticated;
create table backup_20261014.consoles as table public.consoles;
create table backup_20261014.console_variants as table public.console_variants;
create table backup_20261014.console_links as table public.console_links;
create table backup_20261014.console_images as table public.console_images;
create table backup_20261014.manufacturer as table public.manufacturer;
create table backup_20261014.emulation_profiles as table public.emulation_profiles;
create table backup_20261014.variant_input_profile as table public.variant_input_profile;
create table backup_20261014.policies as
  select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
  from pg_policies where schemaname = 'public';
