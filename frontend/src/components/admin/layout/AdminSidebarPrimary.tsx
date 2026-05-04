"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarPrimaryProps {
  groups: any[];
  activeGroupId: string | null;
  onGroupClick: (id: string) => void;
  onLogout: () => void;
}

export default function AdminSidebarPrimary({ groups, activeGroupId, onGroupClick, onLogout }: AdminSidebarPrimaryProps) {
  return (
    <aside className="w-20 bg-slate-900 flex flex-col items-center py-8 gap-8 border-r border-white/5 shadow-2xl z-20">
      <Link href="/admin" className="mb-4">
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-110 transition-transform">
          <span className="text-2xl font-black text-white italic">V</span>
        </div>
      </Link>

      <div className="flex-1 flex flex-col gap-4">
        {groups.map((group) => {
          const isGroupActive = activeGroupId === group.id;
          return (
            <button
              key={group.id}
              onClick={() => onGroupClick(group.id)}
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative group",
                isGroupActive ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110" : "text-slate-500 hover:text-white hover:bg-white/10"
              )}
            >
              <group.icon size={22} />
              {group.badge && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-slate-900 shadow-lg">
                  {group.badge}
                </span>
              )}
              <div className="absolute left-16 bg-slate-800 text-white text-[10px] font-bold px-3 py-2 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 uppercase tracking-widest border border-white/5">
                {group.title}
              </div>
              {isGroupActive && (
                <div className="absolute -left-1 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
              )}
            </button>
          );
        })}
      </div>

      <button onClick={onLogout} className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all mb-4">
        <LogOut size={20} />
      </button>
    </aside>
  );
}
