// types/auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: "ADMIN" | "CLINIC" | "EXPERT" | "CUSTOMER";
  }
  interface Session {
    user?: {
      role?: string;
    } & DefaultSession["user"];
  }
}