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

  if (status === "loading") {
    return (
      <div className="h-screen w-full grid place-items-center">
        Loading...
      </div>
    );
  }

  if (isAuthorized === false) {
    return (
      <div className="h-screen w-full grid place-items-center">
        Redirecting to login...
      </div>
    );
  }

  return <>{children}</>;
};