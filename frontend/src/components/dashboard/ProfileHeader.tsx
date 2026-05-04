"use client";

import { Crown, User, Shield, LogOut } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface ProfileHeaderProps {
  session: any;
}

export default function ProfileHeader({ session }: ProfileHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between mb-16 p-10 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[48px] shadow-2xl relative group">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <Crown size={120} />
      </div>
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-blue-500 p-1">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden border-2 border-slate-900">
              <User size={40} className="text-primary" />
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full border-4 border-slate-950 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
        </div>
        <div className="text-center md:text-left">
          <p className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-2">Membre Élite Vectoria</p>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">
            {session?.user?.name || "L'Excellence"}
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-2">Votre voyage sur mesure continue ici.</p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-6 mt-8 md:mt-0">
        <Link 
          href="/dashboard/profile"
          className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all group"
        >
          <Shield size={16} className="text-primary group-hover:scale-110 transition-transform" /> 
          Sécurité & Profil
        </Link>
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all group"
        >
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform text-red-500" /> 
          Quitter le Salon
        </button>
      </div>
    </header>
  );
}
