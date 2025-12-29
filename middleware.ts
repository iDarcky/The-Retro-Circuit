import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Restored to 'middleware' to enable security headers and auth checks
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

  // SKIP Supabase checks if env vars are missing/placeholder to prevent crashes
  const isPlaceholder = supabaseUrl.includes('placeholder.supabase.co') || supabaseKey === 'placeholder';

  // NOTE: In this environment, likely running with placeholders.
  // If placeholders are present, middleware cannot verify auth via Supabase.

  // If we are in a verifiable environment:
  if (!isPlaceholder) {
    try {
      const supabase = createServerClient(
        supabaseUrl,
        supabaseKey,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value }) => {
                request.cookies.set(name, value);
              });
              response = NextResponse.next({
                request: {
                  headers: request.headers,
                },
              });
              cookiesToSet.forEach(({ name, value, options }) => {
                response.cookies.set(name, value, options);
              });
            },
          },
        }
      );

      // 2. Refresh the session
      const { data: { user } } = await supabase.auth.getUser();

      // 3. Auth Redirection Logic
      const url = request.nextUrl.clone();

      // IF USER IS LOGGED IN
      if (user) {
        // Redirect from /login to /profile
        if (url.pathname.startsWith('/login')) {
            url.pathname = '/profile';
            return NextResponse.redirect(url);
        }
      }
      // IF USER IS NOT LOGGED IN
      else {
        // Protect /profile
        if (url.pathname.startsWith('/profile')) {
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }
      }

      // 4. Protect Admin Routes (Original Logic)
      if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!user) {
          return NextResponse.redirect(new URL('/login', request.url));
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError) {
            console.error('[Middleware] Profile Fetch Error:', profileError.message);
        }

        if (!profile || profile.role !== 'admin') {
          return NextResponse.redirect(new URL('/', request.url));
        }
      }
    } catch (e) {
      console.error('[Middleware] Supabase Client Error:', e);
    }
  }

  // 5. Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), browsing-topics=()');

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
