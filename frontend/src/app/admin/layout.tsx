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
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Calendar, label: "Planning", href: "/admin/calendar" },
  { icon: Car, label: "Flotte", href: "/admin/fleet" },
  { icon: Palette, label: "Storefront", href: "/admin/storefront" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200/60 text-slate-900 flex flex-col fixed h-full z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-10">
          <h2 className="text-3xl font-black tracking-tighter text-slate-900 flex items-center gap-2">
            V <span className="text-primary text-[10px] bg-primary/10 px-2 py-1 rounded-md border border-primary/20 tracking-widest font-black">ADMIN</span>
          </h2>
        </div>

        <nav className="flex-1 px-6 space-y-3 mt-6">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-5 py-4 rounded-2xl transition-all group relative overflow-hidden",
                  isActive 
                    ? "bg-primary text-white shadow-xl shadow-primary/20 font-black" 
                    : "text-slate-400 hover:bg-slate-50 hover:text-primary"
                )}
              >
                <div className="flex items-center gap-3 relative z-10">
                  <item.icon size={22} className={isActive ? "text-white" : "group-hover:text-primary transition-colors"} />
                  <span className="text-sm tracking-tight">{item.label}</span>
                </div>
                {isActive && <ChevronRight size={14} className="relative z-10" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-8 border-t border-slate-100 bg-slate-50/50">
          <button className="flex items-center gap-3 w-full px-5 py-4 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all text-sm font-black">
            <LogOut size={20} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72">
        {/* Top Header */}
        <header className="h-24 bg-white/70 backdrop-blur-2xl border-b border-slate-200/50 sticky top-0 z-40 px-12 flex items-center justify-between">
           <div className="flex items-center gap-3 text-slate-400 text-xs font-black uppercase tracking-widest">
             <span className="hover:text-primary cursor-pointer transition-colors">Vectoria</span>
             <ChevronRight size={12} className="text-slate-300" />
             <span className="text-slate-900 font-black bg-slate-100 px-3 py-1 rounded-full border border-slate-200/50">
               {pathname.split("/").pop() || "Dashboard"}
             </span>
           </div>

           <div className="flex items-center gap-6">
             <div className="text-right">
               <p className="text-sm font-black text-slate-900">Admin Victoria</p>
               <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">Full Access</p>
             </div>
             <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 p-0.5 shadow-sm">
                <img className="w-full h-full rounded-xl object-cover" src={`https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff&size=128`} alt="Avatar" />
             </div>
           </div>
        </header>

        <div className="p-12 pb-24 min-h-[calc(100vh-96px)]">
          {children}
        </div>
      </main>
    </div>
  );
}
