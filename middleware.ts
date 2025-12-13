
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // DIAGNOSTIC LOG: Request Start
  console.log(`[Middleware] ------------------------------------------------`);
  console.log(`[Middleware] Processing: ${request.method} ${request.nextUrl.pathname}`);

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
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the supabase client updates the session, we must update the request/response cookies
          // DIAGNOSTIC LOG: Cookie Set
          console.log(`[Middleware] Setting cookie: ${name}`);
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          // DIAGNOSTIC LOG: Cookie Remove
          console.log(`[Middleware] Removing cookie: ${name}`);
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
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

  // 🛡️ Sentinel: Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

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
