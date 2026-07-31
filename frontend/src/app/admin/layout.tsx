"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Calendar, Car, Palette, Users, Settings, BarChart3, Sliders, Wallet, ClipboardList, FlaskConical, Ban, FileUp, ScrollText
} from "lucide-react";
import { useAuthGuard } from "@/modules/auth/hooks/useAuthGuard";
import { useAuth } from "@/modules/auth/context/context";
import { useState, useMemo } from "react";
import { useTranslation } from "@/shared/hooks/useTranslation";

import AdminSidebar from "@/modules/admin/components/layout/AdminSidebar";
import AdminTopbar from "@/modules/admin/components/layout/AdminTopbar";

function buildMenuGroups(t: (key: string) => string) {
  return [
    {
      id: "general", title: t("sidebar_group_general"), icon: LayoutDashboard, badge: 4,
      items: [
        { icon: LayoutDashboard, label: t("sidebar_item_dashboard"), href: "/admin" },
        { icon: ClipboardList, label: t("sidebar_item_reservations"), href: "/admin/reservations" },
        { icon: Calendar, label: t("sidebar_item_planning"), href: "/admin/calendar" },
        { icon: Wallet, label: t("sidebar_item_treasury"), href: "/admin/expenses" },
      ]
    },
    {
      id: "fleet", title: t("sidebar_group_fleet"), icon: Car,
      items: [
        { icon: Car, label: t("sidebar_item_vehicles"), href: "/admin/fleet" },
        { icon: FileUp, label: t("sidebar_item_import_csv"), href: "/admin/import" },
        { icon: BarChart3, label: t("sidebar_item_analytics"), href: "/admin/analytics" },
      ]
    },
    {
      id: "config", title: t("sidebar_group_config"), icon: Sliders,
      items: [
        { icon: Users, label: t("sidebar_item_users"), href: "/admin/users" },
        { icon: Ban, label: t("sidebar_item_blacklist"), href: "/admin/blacklist" },
        { icon: ScrollText, label: t("sidebar_item_audit_log"), href: "/admin/audit" },
        { icon: Palette, label: t("sidebar_item_storefront"), href: "/admin/storefront" },
        { icon: Settings, label: t("sidebar_item_settings"), href: "/admin/settings" },
        { icon: FlaskConical, label: t("sidebar_item_demo_data"), href: "/admin/demo" },
      ]
    }
  ];
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthGuard("admin");
  const { logout } = useAuth();
  const { t } = useTranslation();
  const MENU_GROUPS = useMemo(() => buildMenuGroups(t), [t]);
  const activeGroupId = useMemo(() => {
    const group = MENU_GROUPS.find(g => g.items.some(i => pathname === i.href || (pathname.startsWith(i.href) && i.href !== "/admin")));
    return group?.id || "general";
  }, [pathname, MENU_GROUPS]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
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
