
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // DIAGNOSTIC LOG: Request Start
  console.log(`[Middleware] ------------------------------------------------`);
  console.log(`[Middleware] Processing: ${request.method} ${request.nextUrl.pathname}`);

  // 1. Initialize Response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Track all cookie changes to ensure we don't lose them when recreating the response
  const changedCookies: { name: string; value: string; options: CookieOptions }[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // 1. Update the request cookies (mutable) so Supabase client sees the new value immediately
          request.cookies.set({
            name,
            value,
            ...options,
          });

          // 2. Track this change
          changedCookies.push({ name, value, options });

          // 3. Re-create the response object
          // This passes the *updated* request cookies to the actual route handler/server component
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });

          // 4. Apply ALL accumulated cookie changes to the new response
          // This ensures that if we set multiple cookies (access + refresh), BOTH Set-Cookie headers exist
          changedCookies.forEach((cookie) => {
            response.cookies.set({
              name: cookie.name,
              value: cookie.value,
              ...cookie.options,
            });
          });
        },
        remove(name: string, options: CookieOptions) {
          // 1. Update request cookies
          request.cookies.set({
            name,
            value: '',
            ...options,
          });

          // 2. Track change (value is empty string for removal)
          changedCookies.push({ name, value: '', options });

          // 3. Re-create response
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });

          // 4. Apply all changes
          changedCookies.forEach((cookie) => {
            response.cookies.set({
              name: cookie.name,
              value: cookie.value,
              ...cookie.options,
            });
          });
        },
      },
    }
  );

  // 2. Refresh the session
  const { data: { user }, error } = await supabase.auth.getUser();

  // DIAGNOSTIC LOG: User Status
  if (user) {
      console.log(`[Middleware] Session Valid. User: ${user.email} (${user.id})`);
  } else {
      console.log(`[Middleware] No Session Found. Error: ${error?.message || 'None'}`);
  }

  // 3. Protect Admin Routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    console.log('[Middleware] Checking Admin Route Access...');
    
    // Check Authentication
    if (!user) {
      console.log('[Middleware] Access Denied: No User. Redirecting to Login.');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check Authorization (Role) via profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
        console.error('[Middleware] Profile Fetch Error:', profileError.message);
    }

    console.log(`[Middleware] User Role: ${profile?.role}`);

    // If no profile or role is not 'admin', redirect to home
    if (!profile || profile.role !== 'admin') {
      console.log('[Middleware] Access Denied: Not Admin. Redirecting to Home.');
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    console.log('[Middleware] Admin Access Granted.');
  }

  // 4. Inject Security Headers
  // Helper to ensure headers exist before setting
  const setHeader = (key: string, value: string) => {
    response.headers.set(key, value);
  };

  setHeader('X-Frame-Options', 'DENY');
  setHeader('X-Content-Type-Options', 'nosniff');
  setHeader('Referrer-Policy', 'origin-when-cross-origin');
  setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (images, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
