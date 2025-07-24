// types/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Extends the built-in session types
   */
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user: {
      id: string;
      uuid: string;
      email: string;
      name: string;
      full_name: string;
      phone_number: string;
      country_code: string;
      role: string;
    } & DefaultSession["user"];
  }

  /**
   * Extends the built-in User type
   */
  interface User {
    id: string;
    uuid: string;
    email: string;
    full_name: string;
    phone_number: string;
    country_code: string;
    role: string;
    accessToken: string;
    refreshToken: string;
  }

  /**
   * Extends the JWT type
   */
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    user?: User;
  }
}