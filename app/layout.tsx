import "./globals.css";
import Head from "next/head";

import type { Metadata } from "next";
import { Domine, Inter, Raleway } from "next/font/google";
import { AuthProvider } from "./Providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const domine = Domine({ subsets: ["latin"], variable: "--font-domine" });
const raleway = Raleway({ subsets: ["latin"], variable: "--font-raleway" });

export const metadata: Metadata = {
  title: "Clinzor | Best Physiotherapy & Clinic Booking App in India",
  description:
    "Book top-rated physiotherapists in India for home visits, in-clinic consultations, and online video calls. Find specialized rehabilitation and recovery experts near you.",
  keywords: "best physiotherapist India, home visit physiotherapy India, online physiotherapy consultation Bharat, clinic booking app India, sports rehab specialist India, physical therapy experts India",
  authors: [{ name: "Clinzor Health" }],
  openGraph: {
    title: "Clinzor | India's Leading Physiotherapy & Healthcare Platform",
    description: "Connect with certified physiotherapists across India for professional recovery and wellness.",
    url: "https://clinzor.com",
    siteName: "Clinzor India",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Domine:wght@400..700&family=Raleway:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <AuthProvider>
        <body className={`${inter.variable} ${domine.variable} ${raleway.variable} antialiased`}>
          {children}
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
