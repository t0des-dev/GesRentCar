"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConciergeAI from "@/modules/ai/components/ConciergeAI";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useAgency } from "@/hooks/useAgency";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const agency = useAgency();
  const isAdmin = pathname?.startsWith("/admin");
  const isAgent = pathname?.startsWith("/agent");
  const isDashboard = pathname?.startsWith("/dashboard");
  const isInternal = isAdmin || isAgent || isDashboard;
  const isHome = pathname === "/";

  return (
    <>
      {!isInternal && <Navbar />}
      <div className="flex flex-col" style={{ 
        minHeight: !isInternal ? 'calc(100vh - 70px)' : '100vh', 
      }}>
        {!isInternal && !isHome && <Breadcrumbs />}
        {children}
        {!isInternal && <Footer />}
      </div>
      {!isInternal && <ConciergeAI />}
    </>
  );
}
