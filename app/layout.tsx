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
  title: "Clinzor | Best Physiotherapy & Clinic Booking App in Bengaluru",
  description:
    "Book top-rated physiotherapists in Bengaluru for home visits, in-clinic consultations, and online video calls. Find specialized rehabilitation and recovery experts near you.",
  keywords: "best physiotherapist Bengaluru, home visit physiotherapy Bengaluru, online physiotherapy consultation Bengaluru, clinic booking app Bengaluru, sports rehab specialist Bengaluru, physical therapy experts Bengaluru",
  authors: [{ name: "Clinzor Health" }],
  openGraph: {
    title: "Clinzor | Bengaluru's Leading Physiotherapy & Healthcare Platform",
    description: "Connect with certified physiotherapists across Bengaluru for professional recovery and wellness.",
    url: "https://clinzor.com",
    siteName: "Clinzor Bengaluru",
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
