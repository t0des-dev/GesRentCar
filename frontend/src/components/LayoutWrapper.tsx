"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConciergeAI from "@/components/ConciergeAI";
import CustomCursor from "@/components/CustomCursor";
import { useAgency } from "@/hooks/useAgency";
import { useEffect } from "react";
import { hexToHsl } from "@/lib/utils";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const agency = useAgency();
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    if (agency.primary_color) {
      document.documentElement.style.setProperty('--primary', hexToHsl(agency.primary_color));
    }
    if (agency.theme_config?.border_radius) {
      document.documentElement.style.setProperty('--radius', agency.theme_config.border_radius);
    }
  }, [agency]);

  return (
    <>
      <CustomCursor />
      {!isAdmin && <Navbar />}
      <div className="flex flex-col" style={{ 
        minHeight: !isAdmin ? 'calc(100vh - 70px)' : '100vh', 
      }}>
        {children}
        {!isAdmin && <Footer />}
      </div>
      {!isAdmin && <ConciergeAI />}
    </>
  );
}
