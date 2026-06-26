// Centralized Supabase env resolution.
//
// In production *runtime* we fail hard if a required variable is missing, so the app
// never silently connects to a placeholder instance (which would bypass real auth/data).
// During the production *build* (NEXT_PHASE === 'phase-production-build') and in
// development we fall back to placeholders so builds/local dev don't crash.

const PLACEHOLDER_URL = 'https://placeholder.supabase.co';
const PLACEHOLDER_KEY = 'placeholder';

const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';
const isProdRuntime = process.env.NODE_ENV === 'production' && !isBuildPhase;

function resolve(name: string, value: string | undefined, placeholder: string): string {
  if (value) return value;
  if (isProdRuntime) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return placeholder;
}

export function getSupabaseUrl(): string {
  return resolve('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL, PLACEHOLDER_URL);
}

export function getSupabaseAnonKey(): string {
  return resolve('NEXT_PUBLIC_SUPABASE_ANON_KEY', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, PLACEHOLDER_KEY);
}

export function getServiceRoleKey(): string {
  return resolve('SUPABASE_SERVICE_ROLE_KEY', process.env.SUPABASE_SERVICE_ROLE_KEY, PLACEHOLDER_KEY);
}
