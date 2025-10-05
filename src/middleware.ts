import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === 'admin';
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');

    // Redirect non-admin users from admin routes
    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAuthRoute = req.nextUrl.pathname.startsWith('/admin') ||
                           req.nextUrl.pathname.startsWith('/orders') ||
                           req.nextUrl.pathname.startsWith('/checkout');
        
        if (isAuthRoute) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/orders/:path*', '/checkout/:path*'],
};