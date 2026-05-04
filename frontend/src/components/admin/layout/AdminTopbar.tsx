"use client";

import { Bell, ChevronRight } from "lucide-react";

interface AdminTopbarProps {
  pathname: string;
  activeGroupTitle: string;
  user: any;
}

export default function AdminTopbar({ pathname, activeGroupTitle, user }: AdminTopbarProps) {
  const currentPathLabel = pathname.split("/").pop() || "dashboard";

  return (
    <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-12 shrink-0">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
          <span className="hover:text-primary cursor-pointer transition-colors">Admin</span>
          <ChevronRight size={10} className="text-slate-300" />
          <span className="text-slate-900 bg-slate-100 px-3 py-1 rounded-full border border-slate-200/50 lowercase first-letter:uppercase">
            {activeGroupTitle}
          </span>
          <ChevronRight size={10} className="text-slate-300" />
          <span className="text-primary font-black">{currentPathLabel}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/60">
          <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary transition-all shadow-sm relative">
            <Bell size={18} /><span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          <div className="h-8 w-px bg-slate-200 mx-1" />
          <div className="flex items-center gap-3 pr-2">
            <div className="text-right hidden md:block">
              <p className="text-[11px] font-black text-slate-900 leading-none mb-1">{user?.name || "Admin"}</p>
              <p className="text-[8px] text-green-500 font-bold uppercase tracking-widest">En ligne</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 p-0.5 shadow-md">
              <img className="w-full h-full rounded-[9px] object-cover" src={`https://ui-avatars.com/api/?name=${user?.name || "Admin"}&background=6366f1&color=fff`} alt="Avatar" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
