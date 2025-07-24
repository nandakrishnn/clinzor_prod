// axios.ts
import axios from "axios";
import { baseUrl } from "@/utils/Endpoint";
import { getSession } from "next-auth/react";

const BASE_URL = baseUrl;

const defaultInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const privateInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});


interface CustomSession {
  accessToken?: string;
 
}

// 🔐 Attach accessToken from NextAuth to each request
privateInstance.interceptors.request.use(
  async (config) => {
    const session = (await getSession()) as CustomSession | null;
    if (session?.accessToken) {
      config.headers["Authorization"] = `Bearer ${session.accessToken}`;
      console.log("✅ Authorization header added:", config.headers["Authorization"]);
    } else {
      console.warn("⚠️ No access token found in session");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default defaultInstance;
export const axiosPrivate = privateInstance;