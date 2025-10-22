// axios.ts
import { baseUrl } from "@/utils/Endpoint";
import axios from "axios";
import { getSession, signOut } from "next-auth/react";

// Create axios instance with proper defaults
const privateInstance = axios.create({
  baseURL: baseUrl,
  timeout: 10000, // Add timeout
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  withCredentials: true
});

export const axiosPublic = axios.create({
  baseURL: baseUrl,
  timeout: 10000, // Add timeout
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  withCredentials: true
})

interface CustomSession {
  accessToken?: string;
  refreshToken?: string;
}

// Enhanced request interceptor
privateInstance.interceptors.request.use(
  async (config) => {
    // Only run on client-side
    if (typeof window === "undefined") {
      console.warn("Axios request made on server side");
      return config;
    }

    try {
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      } else {
        signOut({ callbackUrl: "/auth" })
        if (typeof window !== "undefined") {
          localStorage.clear();
          sessionStorage.clear();
        }
        console.warn("No access token - redirecting to login");
        return Promise.reject(new Error("Missing access token"));
      }
    } catch (error) {
      console.error("Session retrieval error:", error);
      return Promise.reject(error);
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Enhanced response interceptor
privateInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error("API Error:", {
      config: error.config,
      response: error.response,
      message: error.message
    });

    if (error.code === "ERR_NETWORK") {
      console.error("Network error detected - check backend availability");
    }

    return Promise.reject(error);
  }
);

export const axiosPrivate = privateInstance;