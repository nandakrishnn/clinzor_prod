import "./globals.css";
import Head from "next/head";

import type { Metadata } from "next";
import { Domine, Inter, Raleway } from "next/font/google";
import { AuthProvider } from "./Providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({  subsets: ["latin"], variable: "--font-inter"});
const domine = Domine({ subsets: ["latin"], variable: "--font-domine" });
const raleway = Raleway({ subsets: ["latin"], variable: "--font-raleway" });

export const metadata: Metadata = {
  title: "Clinzor",
  description:
    "Instantly find clinics, book telehealth consultations, or schedule home visits with top specialists in your area."
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
