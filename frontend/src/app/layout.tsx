import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { LanguageProvider } from "@/shared/hooks/useTranslation";
import ReactQueryProvider from "@/lib/QueryProvider";
import CompareFloatingBar from "@/components/CompareFloatingBar";
import LayoutWrapper from "@/components/LayoutWrapper";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/modules/auth/context/context";
import { CurrencyProvider } from "@/shared/hooks/useCurrency";
import { Toaster } from "react-hot-toast";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ConciergeAI from "@/modules/ai/components/ConciergeAI";
import CustomCursor from "@/components/CustomCursor";
import SkipNav from "@/components/SkipNav";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "VectoriaRentCar - Premium Car Rental",
  description: "Location de véhicules premium au Maroc. Flotte d'exception, service conciergerie 24/7.",
  manifest: "/manifest.json",
  themeColor: "#D4AF37",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Vectoria",
  },
  openGraph: {
    title: "VectoriaRentCar - Premium Fleet",
    description: "Book your luxury car today with VectoriaRentCar.",
    url: "https://vectoria.carbonick.com",
    siteName: "VectoriaRentCar",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "fr_MA",
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
      <body className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}>
        <ThemeProvider>
          <SkipNav />
          <AuthProvider>
            <ReactQueryProvider>
              <LanguageProvider>
                <CurrencyProvider>
                  <CustomCursor />
                  <ServiceWorkerRegister />
                  <LayoutWrapper>
                    <div id="main-content" tabIndex={-1} className="outline-none">{children}</div>
                    <ConciergeAI />
                  </LayoutWrapper>
                  <CompareFloatingBar />
                  <WhatsAppFloat />
                  <Toaster position="bottom-left" containerClassName="!bottom-24 md:!bottom-4" toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#0f172a',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '16px',
                      fontSize: '14px',
                      fontWeight: '600',
                      padding: '12px 24px',
                    }
                  }} />
                </CurrencyProvider>
              </LanguageProvider>
            </ReactQueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
