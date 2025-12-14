
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
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

  const path = request.nextUrl.pathname;

  // 2. Conditional Session Refresh
  // We ONLY refresh the session (call getUser) on routes that require Server-Side Auth.
  // This prevents race conditions where both Middleware and Client SDK try to refresh
  // the token simultaneously, causing a "Token Reuse" revocation.
  const isProtectedRoute = path.startsWith('/admin');
  const isAuthRoute = path.startsWith('/login');

  let user = null;

  if (isProtectedRoute || isAuthRoute) {
    // Check/Refresh session only for these routes
    const { data, error } = await supabase.auth.getUser();
    user = data.user;

    if (error) {
       // Diagnostic log only if error is not "Auth session missing!"
       // console.log(`[Middleware] Auth Check Error on ${path}: ${error.message}`);
    }
  }

  // 3. Protect Admin Routes
  if (isProtectedRoute) {
    // Check Authentication
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check Authorization (Role) via profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || profile.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 4. Redirect Logged-In Users away from Login
  if (isAuthRoute && user) {
     return NextResponse.redirect(new URL('/admin', request.url));
  }

  // 5. Inject Security Headers
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
