import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// Initialize Redis client explicitly with the Vercel KV env vars
const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

let ratelimit: Ratelimit | null = null;

if (redisUrl && redisToken) {
  const redis = new Redis({ url: redisUrl, token: redisToken });
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, '1 m'), // 60 requests per minute per IP globally
    analytics: false,
    prefix: 'ratelimit:global',
  });
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // --- 1. Global Rate Limiting ---
  if (ratelimit) {
    // Extract IP address from headers
    let ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip');
    if (ip) {
      ip = ip.split(',')[0].trim();
    } else {
      ip = 'anonymous'; // Fallback
    }

    try {
      const { success } = await ratelimit.limit(ip);
      if (!success) {
        return new NextResponse(
          JSON.stringify({ error: 'Too Many Requests', message: 'You have been rate limited.' }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } catch (e) {
      console.warn('Rate limit error, failing open:', e);
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

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

    const isLoginRoute = request.nextUrl.pathname.startsWith('/login');
    const isProfileRoute = request.nextUrl.pathname.startsWith('/profile');
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/design');

    // 3. Auth Redirection Logic
    const url = request.nextUrl.clone();

    // IF USER IS LOGGED IN
    if (user) {
      // Redirect from /login to /profile
      if (isLoginRoute) {
        url.pathname = '/profile';
        return NextResponse.redirect(url);
      }
    }
    // IF USER IS NOT LOGGED IN
    else {
      // Protect /profile
      if (isProfileRoute) {
        url.pathname = '/login';
        return NextResponse.redirect(url);
      }
    }

    // 4. Protect Admin Routes
    if (isAdminRoute) {
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
    // Fail closed if Supabase fails
    const isProfileRoute = request.nextUrl.pathname.startsWith('/profile');
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/design');
    if (isAdminRoute || isProfileRoute) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 5. Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), browsing-topics=()');

  // Content Security Policy
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval'; /* unsafe-eval required for Next.js dev */
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self' data:;
    connect-src 'self' ${supabaseUrl};
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, ' ')
    .trim();

  response.headers.set('Content-Security-Policy', cspHeader);

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
