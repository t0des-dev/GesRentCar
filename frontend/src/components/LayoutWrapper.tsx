"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConciergeAI from "@/modules/ai/components/ConciergeAI";
import CustomCursor from "@/components/CustomCursor";
import { useAgency } from "@/hooks/useAgency";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const agency = useAgency();
  const isAdmin = pathname?.startsWith("/admin");

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
