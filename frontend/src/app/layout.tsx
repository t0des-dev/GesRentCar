import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { LanguageProvider } from "@/hooks/useTranslation";
import ReactQueryProvider from "@/lib/QueryProvider";
import CompareFloatingBar from "@/components/CompareFloatingBar";
import LayoutWrapper from "@/components/LayoutWrapper";
import { SessionProvider } from "next-auth/react";
import ConciergeAI from "@/components/ConciergeAI";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VectoriaRentCar - Premium Car Rental",
  description: "Centralized car rental management system for modern agencies. Experience luxury and performance.",
  openGraph: {
    title: "VectoriaRentCar - Premium Fleet",
    description: "Book your luxury car today with VectoriaRentCar.",
    url: "https://vectoria-rent.com",
    siteName: "VectoriaRentCar",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VectoriaRentCar",
    description: "Premium car rental ecosystem.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SessionProvider>
          <ReactQueryProvider>
            <LanguageProvider>
              <ServiceWorkerRegister />
              <LayoutWrapper>
                {children}
                <ConciergeAI />
              </LayoutWrapper>
              <CompareFloatingBar />
            </LanguageProvider>
          </ReactQueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
