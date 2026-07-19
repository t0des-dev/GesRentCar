import type { Metadata, Viewport } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";

import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { LanguageProvider } from "@/shared/hooks/useTranslation";
import ReactQueryProvider from "@/lib/QueryProvider";
import LayoutWrapper from "@/components/LayoutWrapper";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/modules/auth/context/context";
import { CurrencyProvider } from "@/shared/hooks/useCurrency";
import { Toaster } from "react-hot-toast";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import SkipNav from "@/components/SkipNav";
import { ThemeProvider } from "@/components/ThemeProvider";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import OfflineIndicator from "@/components/OfflineIndicator";
import Analytics, { AnalyticsProvider } from "@/components/Analytics";
import { AccessibilityProvider } from "@/components/AccessibilityProvider";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "VectoriaRentCar - Premium Car Rental",
  description: "Location de véhicules premium au Maroc. Flotte d'exception, service conciergerie 24/7.",
  manifest: "/manifest.json",
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

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  themeColor: "#D4AF37",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${sora.variable} ${inter.variable}`}>
        <ThemeProvider>
          <AccessibilityProvider>
            <AnalyticsProvider>
              <SkipNav />
              <AuthProvider>
                <ReactQueryProvider>
                  <LanguageProvider>
                    <CurrencyProvider>
                      <ServiceWorkerRegister />
                      <Analytics />
                      <LayoutWrapper>
                        <div id="main-content" tabIndex={-1} className="outline-none">{children}</div>
                      </LayoutWrapper>
                      <WhatsAppFloat />
                      <PWAInstallPrompt />
                      <OfflineIndicator />
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
            </AnalyticsProvider>
          </AccessibilityProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
