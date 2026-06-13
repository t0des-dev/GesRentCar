"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Calendar, Car, Palette, Users, Settings, BarChart3, Sliders
} from "lucide-react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useState, useEffect } from "react";

import AdminSidebarPrimary from "@/components/admin/layout/AdminSidebarPrimary";
import AdminSidebarSecondary from "@/components/admin/layout/AdminSidebarSecondary";
import AdminTopbar from "@/components/admin/layout/AdminTopbar";

const MENU_GROUPS = [
  {
    id: "general", title: "Général", icon: LayoutDashboard, badge: 3,
    items: [
      { icon: LayoutDashboard, label: "Tableau de bord", href: "/admin" },
      { icon: Calendar, label: "Planning", href: "/admin/calendar" },
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
      <div className="flex h-screen sticky top-0 z-50">
        <AdminSidebarPrimary
          groups={MENU_GROUPS}
          activeGroupId={activeGroupId}
          onGroupClick={(id) => { setActiveGroupId(id); setIsCollapsed(false); }}
          onLogout={handleLogout}
        />
        <AdminSidebarSecondary
          activeGroup={activeGroup}
          pathname={pathname}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          user={user}
        />
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminTopbar pathname={pathname} activeGroupTitle={activeGroup.title} user={user} />
        <main className="flex-1 overflow-y-auto p-8 pb-24 no-scrollbar">
          <div className="page-container">{children}</div>
        </main>
      </div>
    </div>
  );
}
