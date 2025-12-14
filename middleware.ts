
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // 1. Initialize Response
  // We start with a response that copies the request headers.
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // 1. Update the request cookies (mutable) so Supabase client sees the new values immediately
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set({
              name,
              value,
              ...options,
            });
          });

          // 2. Re-create the response object
          // This passes the *updated* request cookies to the actual route handler/server component
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });

          // 3. Apply ALL cookies to the new response
          // setAll gives us the complete list of cookies that need to be set
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set({
              name,
              value,
              ...options,
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
  // Note: We also skip static files (handled by matcher) and API routes (handled by client SDK usually).
  const isProtectedRoute = path.startsWith('/admin');
  const isAuthRoute = path.startsWith('/login');

  let user = null;

  if (isProtectedRoute || isAuthRoute) {
    // Check/Refresh session only for these routes
    const { data, error } = await supabase.auth.getUser();
    user = data.user;

    if (error) {
       // Diagnostic log
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
