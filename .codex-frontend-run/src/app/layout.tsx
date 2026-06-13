import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { LanguageProvider } from "@/hooks/useTranslation";
import ReactQueryProvider from "@/lib/QueryProvider";
import ConciergeAILoader from "@/components/ConciergeAILoader";
import CompareFloatingBarLoader from "@/components/CompareFloatingBarLoader";
import LayoutWrapper from "@/components/LayoutWrapper";
import CustomCursor from "@/components/CustomCursor";
import SkipNav from "@/components/SkipNav";
import { AuthProvider } from "@/lib/auth/context";
import { CurrencyProvider } from "@/hooks/useCurrency";
import { Toaster } from "react-hot-toast";

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
    <html lang="en" suppressHydrationWarning className={`${instrumentSerif.variable} ${inter.variable}`}>
      <body>
        <SkipNav />
        <AuthProvider>
          <ReactQueryProvider>
            <LanguageProvider>
              <CurrencyProvider>
                <CustomCursor />
                <ServiceWorkerRegister />
                <LayoutWrapper>
                  <div id="main-content" tabIndex={-1} className="outline-none">{children}</div>
                  <ConciergeAILoader />
                </LayoutWrapper>
                <CompareFloatingBarLoader />
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
      </body>
    </html>
  );
}
