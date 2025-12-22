// app/api/auth/[...nextauth]/route.ts
import { baseUrl, login } from "@/utils/Endpoint";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

const API_BASE_URL = baseUrl;

interface ApiResponse {
  access: string;
  refresh: string;
  user: {
    uuid: string;
    email: string;
    full_name: string;
    phone_number: string;
    country_code: string;
    role: string;
    is_active: boolean;
    is_staff: boolean;
    is_superuser: boolean;
  };
  error?: any
}
interface VerifyOtpResponse {
  message: string;
  data: {
    access: string;
    refresh: string;
    user: {
      uuid: string;
      email: string;
      full_name: string;
      phone_number: string;
      country_code: string;
      role: string;
      is_active: boolean;
      is_staff: boolean;
      is_superuser: boolean;
    };

  }
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { email, password } = credentials;

        try {
          const res = await fetch(`${API_BASE_URL}${login}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
              password: password,
            }),
          });

          const data: ApiResponse = await res.json();

          if (res.ok && data.access) {
            // Map backend role string to NextAuth accepted role type
            const allowedRoles = ["ADMIN", "CLINIC", "EXPERT", "CUSTOMER"] as const;
            const backendRole = (data.user.role || "").toUpperCase();
            const mappedRole = allowedRoles.includes(backendRole as any) ? backendRole as typeof allowedRoles[number] : undefined;

            return {
              id: data.user.uuid,
              uuid: data.user.uuid,
              email: data.user.email,
              name: data.user.full_name,
              full_name: data.user.full_name,
              phone_number: data.user.phone_number,
              country_code: data.user.country_code,
              role: mappedRole,
              accessToken: data.access,
              refreshToken: data.refresh,
            };
          }
          console.error("Login failed:", data);

          const errorMessage = data?.error
            ? (typeof data.error === 'string' ? data.error : JSON.stringify(data.error))
            : "Invalid credentials";

          throw new Error(errorMessage);

        } catch (err: any) {
          console.error("Login error:", err);
          throw new Error(err.message || "Login failed");
        }
      },
    }),
    CredentialsProvider({
      id: "otp",
      name: "otp",
      credentials: {
        phone_number: { label: "Phone Number", type: "text" },
        otp: { label: "OTP", type: "text" },
        refrence_id: { label: "Reference ID", type: "text" },
        full_name: { label: "Full Name", type: "text", optional: true },
        email: { label: "Email", type: "email", optional: true },
        address: { label: "Address", type: "text", optional: true },
        authMode: { label: "Auth Mode", type: "text" },
        dob: { label: "Date of Birth", type: "text", optional: true },
        gender: { label: "Gender", type: "text", optional: true }
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { phone_number, otp, refrence_id, full_name, email, address, authMode, dob, gender } = credentials;

        try {
          // Prepare the request body based on auth mode
          let requestBody: any = {
            otp,
            refrence_id
          };

          // Only include user details for registration, not for login
          if (authMode === "register") {
            requestBody = {
              ...requestBody,
              full_name,
              email,
              address,
              dob,
              gender
            };
          }

          // Verify OTP for customer authentication
          const verifyResponse = await fetch(`${API_BASE_URL}user/validate-otp/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          });

          const verifyData: VerifyOtpResponse = await verifyResponse.json();

          if (!verifyResponse.ok) {
            // Extract error message from response
            const errorMessage = verifyData?.message || "OTP verification failed";
            throw new Error(errorMessage);
          }

          if (verifyData?.data && verifyData?.data?.access) {
            // For OTP authentication, always set role as CUSTOMER
            return {
              id: verifyData?.data?.user.uuid,
              uuid: verifyData?.data?.user.uuid,
              email: verifyData?.data?.user.email,
              name: verifyData?.data?.user.full_name,
              full_name: verifyData?.data?.user.full_name,
              phone_number: verifyData?.data?.user.phone_number,
              country_code: verifyData?.data?.user.country_code,
              role: "CUSTOMER",
              accessToken: verifyData?.data?.access,
              refreshToken: verifyData?.data?.refresh,
            };
          }

          throw new Error("Invalid response from server");
        } catch (err: any) {
          throw new Error(err.message || "OTP verification failed");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET as string,
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role;
        token.uuid = user.uuid;
        token.user = {
          id: user.id,
          uuid: user.uuid,
          email: user.email,
          name: user.name,
          full_name: user.full_name,
          phone_number: user.phone_number,
          country_code: user.country_code,
          role: user.role,
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.user = {
        ...session.user,
        ...(token.user as object),
      };
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
