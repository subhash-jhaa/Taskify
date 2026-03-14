import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware for Route Protection
 * - Checks for 'accessToken' or 'refreshToken' cookie presence.
 * - Redirects unauthenticated users to /login if they attempt to access protected routes.
 * - Redirects authenticated users to /dashboard if they attempt to access public auth routes.
 */
export function middleware(request: NextRequest) {
    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;
    const clientSession = request.cookies.get('client_session')?.value;
    const isAuthenticated = !!(accessToken || refreshToken || clientSession);

    const { pathname } = request.nextUrl;

    // Define protected and public routes
    const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/tasks');
    const isPublicAuthRoute = pathname === '/login' || pathname === '/register';

    // 1. Redirect unauthenticated users away from protected routes
    if (isProtectedRoute && !isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 2. Redirect authenticated users away from /login and /register
    if (isPublicAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

// Config specifies which routes this middleware should run on
export const config = {
    matcher: ['/dashboard/:path*', '/tasks/:path*', '/login', '/register'],
};
