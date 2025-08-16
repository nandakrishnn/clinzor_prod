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
            return {
              id: data.user.uuid,
              uuid: data.user.uuid,
              email: data.user.email,
              name: data.user.full_name,
              full_name: data.user.full_name,
              phone_number: data.user.phone_number,
              country_code: data.user.country_code,
              role: data.user.role,
              accessToken: data.access,
              refreshToken: data.refresh,
            };
          }

          console.error("Login failed:", data);
          return null;
        } catch (err) {
          console.error("Login error:", err);
          return null;
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
    signIn: "/login",
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
