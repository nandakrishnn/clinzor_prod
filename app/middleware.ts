// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define your role types explicitly
type AppRole = "ADMIN" | "CLINIC" | "EXPERT" | "CUSTOMER";

// Type-safe route mappings
const rolePaths: Record<AppRole, string> = {
  ADMIN: '/admin',
  CLINIC: '/clinic',
  EXPERT: '/expert',
  CUSTOMER: '/customer',
};

const authPages: Record<AppRole, string> = {
  ADMIN: '/auth/adminauthentication',
  CLINIC: '/auth/clinicportallogin',
  EXPERT: '/auth/expertauthentication',
  CUSTOMER: '/auth/customerauthentication',
};

export default withAuth(
  function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    // Use request.nextauth.token as provided by next-auth middleware
    const token = (request as any).nextauth?.token || (request as any).nextauth?.session?.token;

    // Find the role that matches the current path
    const currentRoleEntry = Object.entries(rolePaths).find(([_, path]) => 
      pathname.startsWith(path)
    );

    if (currentRoleEntry) {
      const [requiredRole] = currentRoleEntry as [AppRole, string];

      // No session - redirect to role-specific login
      if (!token) {
        return NextResponse.redirect(new URL(authPages[requiredRole], request.url));
      }

      if (token?.role !== requiredRole && token?.user?.role !== requiredRole) {
        const response = NextResponse.redirect(new URL(authPages[requiredRole], request.url));
        response.cookies.delete('next-auth.session-token');
        response.cookies.delete('next-auth.callback-url');
        return response;
      }
    }

    // Check if accessing an auth page while authenticated
    const currentAuthPage = Object.entries(authPages).find(([_, path]) =>
      pathname.startsWith(path)
    );

    if (currentAuthPage && token) {
      const [userRole] = currentAuthPage as [AppRole, string];
      if (token?.role === userRole || token?.user?.role === userRole) {
        return NextResponse.redirect(new URL(rolePaths[userRole], request.url));
      }
      return NextResponse.redirect(new URL(rolePaths[userRole], request.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }: { token?: any }) => !!token, // Simplified
    },
  }
);

export const config = {
  matcher: [
    '/admin/',
    '/clinic/',
    '/expert/',
    '/customer/',
    '/auth/',
  ],
};