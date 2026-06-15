"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Calendar, Car, Palette, Users, Settings, BarChart3, Sliders, Wallet
} from "lucide-react";
import { useAuthGuard } from "@/modules/auth/hooks/useAuthGuard";
import { useState, useEffect } from "react";

import AdminSidebar from "@/modules/admin/components/layout/AdminSidebar";
import AdminTopbar from "@/modules/admin/components/layout/AdminTopbar";

const MENU_GROUPS = [
  {
    id: "general", title: "Général", icon: LayoutDashboard, badge: 3,
    items: [
      { icon: LayoutDashboard, label: "Tableau de bord", href: "/admin" },
      { icon: Calendar, label: "Planning", href: "/admin/calendar" },
      { icon: Wallet, label: "Trésorerie", href: "/admin/expenses" },
    ]
  },
  {
    id: "fleet", title: "Flotte", icon: Car,
    items: [
      { icon: Car, label: "Véhicules", href: "/admin/fleet" },
      { icon: BarChart3, label: "Analytiques", href: "/admin/analytics" },
    ]
  },
  {
    id: "config", title: "Configuration", icon: Sliders,
    items: [
      { icon: Users, label: "Utilisateurs", href: "/admin/users" },
      { icon: Palette, label: "Storefront", href: "/admin/storefront" },
      { icon: Settings, label: "Paramètres", href: "/admin/settings" },
    ]
  }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthGuard("admin");
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const group = MENU_GROUPS.find(g => g.items.some(i => pathname === i.href || (pathname.startsWith(i.href) && i.href !== "/admin")));
    setActiveGroupId(group?.id || "general");
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("vectoria_token");
    localStorage.removeItem("vectoria_user");
    router.replace("/login");
  };

  const activeGroup = MENU_GROUPS.find(g => g.id === activeGroupId) || MENU_GROUPS[0];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <AdminSidebar
        groups={MENU_GROUPS}
        pathname={pathname}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        onLogout={handleLogout}
        user={user}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminTopbar 
          pathname={pathname} 
          activeGroupTitle={activeGroup.title} 
          user={user} 
          onToggleMobile={() => setIsMobileOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 no-scrollbar">
          <div className="page-container">{children}</div>
        </main>
      </div>
    </div>
  );
}
