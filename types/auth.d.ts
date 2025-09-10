// types/auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: "ADMIN" | "CLINIC" | "EXPERT" | "CUSTOMER";
    address?: string;
    phone_number?: string;
  }
  interface Session {
    user?: {
      role?: string;
      address?: string;
      phone_number?: string;
      phone_number?: string;
    } & DefaultSession["user"];
  }
}