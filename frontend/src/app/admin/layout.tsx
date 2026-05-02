"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Calendar, 
  Car, 
  Palette, 
  Users, 
  Settings, 
  LogOut,
  ChevronRight,
  Bell,
  Search,
  Receipt,
  BarChart3,
  UserCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";

const MENU_GROUPS = [
  {
    title: "Général",
    items: [
      { icon: LayoutDashboard, label: "Tableau de bord", href: "/admin" },
      { icon: Calendar, label: "Planning & Réservations", href: "/admin/calendar" },
    ]
  },
  {
    title: "Gestion Fleet",
    items: [
      { icon: Car, label: "Véhicules", href: "/admin/fleet" },
      { icon: BarChart3, label: "Analytiques", href: "/admin/analytics" },
    ]
  },
  {
    title: "Configuration",
    items: [
      { icon: Users, label: "Utilisateurs", href: "/admin/users" },
      { icon: Palette, label: "Apparence Store", href: "/admin/storefront" },
      { icon: Settings, label: "Paramètres", href: "/admin/settings" },
    ]
  }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthGuard("admin");

  const handleLogout = () => {
    localStorage.removeItem("vectoria_token");
    localStorage.removeItem("vectoria_user");
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex font-sans selection:bg-primary/10">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-slate-200/60 text-slate-900 flex flex-col fixed h-full z-50 overflow-hidden shadow-[10px_0_40px_rgba(0,0,0,0.02)]">
        {/* Brand Logo */}
        <div className="px-10 pt-12 pb-8">
          <Link href="/admin" className="group block">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl font-black text-white italic">V</span>
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-900 group-hover:text-primary transition-colors">
                  Vectoria
                </h2>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Admin <span className="text-primary">System</span>
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-4 space-y-10">
          {MENU_GROUPS.map((group, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="px-5 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 relative",
                        isActive 
                          ? "bg-primary text-white shadow-xl shadow-primary/25" 
                          : "text-slate-500 hover:bg-slate-50 hover:text-primary"
                      )}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="activeTab"
                          className="absolute inset-0 bg-primary rounded-2xl z-0"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      
                      <div className="flex items-center gap-4 relative z-10">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                          isActive ? "bg-white/20" : "bg-slate-50 group-hover:bg-primary/10"
                        )}>
                          <item.icon size={18} strokeWidth={2.5} className={isActive ? "text-white" : "text-slate-400 group-hover:text-primary"} />
                        </div>
                        <span className="text-sm font-bold tracking-tight">{item.label}</span>
                      </div>

                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="relative z-10"
                        >
                          <ChevronRight size={14} strokeWidth={3} />
                        </motion.div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom User Profile Section */}
        <div className="p-6 border-t border-slate-100 mt-auto bg-slate-50/50">
          <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-sm mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-primary/10 shadow-md" 
                  src={`https://ui-avatars.com/api/?name=${user?.name || "Admin"}&background=6366f1&color=fff`}
                  alt="Admin" 
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-slate-900 truncate">{user?.name || "Administrateur"}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{user?.role || "Super Admin"}</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 w-full px-5 py-4 rounded-2xl text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all duration-300 text-xs font-black uppercase tracking-widest border border-transparent hover:border-red-100 shadow-sm hover:shadow-none bg-white"
          >
            <LogOut size={16} strokeWidth={3} />
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-80 min-h-screen">
        {/* Top Header */}
        <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40 px-12 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 cursor-pointer transition-all">
                <Search size={18} />
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <span className="hover:text-primary cursor-pointer transition-colors">Admin</span>
                <ChevronRight size={10} className="text-slate-300" />
                <span className="text-slate-900 bg-slate-100 px-3 py-1 rounded-full border border-slate-200/50 lowercase first-letter:uppercase">
                  {pathname.split("/").pop() || "dashboard"}
                </span>
              </div>
           </div>

           <div className="flex items-center gap-6">
             <button className="relative w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 transition-all shadow-sm">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse" />
             </button>
             <div className="h-10 w-px bg-slate-200" />
             <div className="flex items-center gap-4 group cursor-pointer">
               <div className="text-right">
                 <p className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">{user?.name || "Admin"}</p>
                 <div className="flex items-center justify-end gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Online</p>
                 </div>
               </div>
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-blue-600 p-0.5 shadow-lg shadow-primary/20 group-hover:scale-105 transition-all duration-300">
                  <img 
                    className="w-full h-full rounded-[14px] object-cover border border-white/20" 
                    src={`https://ui-avatars.com/api/?name=${user?.name || "Admin"}&background=6366f1&color=fff`}
                    alt="Avatar" 
                  />
               </div>
             </div>
           </div>
        </header>

        <div className="p-12 pb-24 min-h-[calc(100vh-96px)] max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
