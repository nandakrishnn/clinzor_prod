"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

// Role-based provider components
export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <RoleBasedProvider allowedRoles={["ADMIN"]} authPath="/auth/adminauthentication">
      {children}
    </RoleBasedProvider>
  );
};

export const ClinicProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <RoleBasedProvider allowedRoles={["CLINIC"]} authPath="/auth/clinicauthentication">
      {children}
    </RoleBasedProvider>
  );
};

export const ExpertProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <RoleBasedProvider allowedRoles={["EXPERT"]} authPath="/auth/expertauthentication">
      {children}
    </RoleBasedProvider>
  );
};

export const CustomerProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <RoleBasedProvider allowedRoles={["CUSTOMER"]} authPath="/auth/customerauthentication">
      {children}
    </RoleBasedProvider>
  );
};

// Generic role-based provider
const RoleBasedProvider = ({
  children,
  allowedRoles,
  authPath,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
  authPath: string;
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      setIsAuthorized(false);
      router.push(authPath);
    } else if (session.user.role && !allowedRoles.includes(session.user.role)) {
      setIsAuthorized(false);
      router.push(authPath);
    } else {
      setIsAuthorized(true);
    }
  }, [session, status, router, allowedRoles, authPath]);
   // Show loading state that covers the entire screen
  if (status === "loading" || isAuthorized === null) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

    if (isAuthorized === false) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
        <p className="text-lg">Redirecting to login...</p>
      </div>
    );
  }

  return <>{children}</>;
};