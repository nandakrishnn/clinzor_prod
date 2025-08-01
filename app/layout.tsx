import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./Providers";
import { NavbarDemo } from "@/components/landingpage/navbar/navbar";
import FooterSection from "@/components/landingpage/footer/footer";
import Head from "next/head";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

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
        <body className={`${inter.variable} antialiased`}>
          {/* Content */}
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}
