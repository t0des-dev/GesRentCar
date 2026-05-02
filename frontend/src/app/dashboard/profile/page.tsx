"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  User, Mail, Lock, Shield, CheckCircle2, 
  Loader2, ArrowLeft, Save, KeyRound, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api/client";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Profile Form
  const [profileData, setProfileData] = useState({
    name: "",
    email: ""
  });

  // Password Form
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    password: "",
    password_confirmation: ""
  });

  useEffect(() => {
    setMounted(true);
    if (session?.user) {
      setProfileData({
        name: session.user.name || "",
        email: session.user.email || ""
      });
    }
  }, [session]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await api.put("/user/profile", profileData);
      setMsg({ type: "success", text: "Votre profil a été mis à jour avec succès." });
      // Update next-auth session
      await update({
        ...session,
        user: { ...session?.user, name: profileData.name, email: profileData.email }
      });
    } catch (err: any) {
      setMsg({ type: "error", text: err.response?.data?.message || "Une erreur est survenue." });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.password !== passwordData.password_confirmation) {
      setMsg({ type: "error", text: "Les mots de passe ne correspondent pas." });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      await api.put("/user/password", passwordData);
      setMsg({ type: "success", text: "Votre mot de passe a été modifié avec succès." });
      setPasswordData({ current_password: "", password: "", password_confirmation: "" });
    } catch (err: any) {
      setMsg({ type: "error", text: err.response?.data?.message || "Erreur lors du changement de mot de passe." });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 pb-24 relative overflow-hidden">
      {/* Ambient BG */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/4 pointer-events-none" />
      
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        
        {/* Header Navigation */}
        <div className="mb-12">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-black text-[10px] uppercase tracking-[0.2em] mb-6">
            <ArrowLeft size={14} /> Retour au Salon VIP
          </Link>
          <div className="flex items-end gap-6">
            <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <User size={32} className="text-primary" />
            </div>
            <div>
              <p className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-2">Paramètres de sécurité</p>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Votre Profil Élite</h1>
            </div>
          </div>
        </div>

        {/* Global Notifications */}
        <AnimatePresence>
          {msg && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={cn(
                "p-6 rounded-[24px] mb-8 flex items-center gap-4 border backdrop-blur-xl shadow-2xl",
                msg.type === "success" 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                  : "bg-red-500/10 border-red-500/20 text-red-400"
              )}
            >
              {msg.type === "success" ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
              <p className="text-sm font-bold tracking-wide">{msg.text}</p>
              <button onClick={() => setMsg(null)} className="ml-auto text-current opacity-40 hover:opacity-100 transition-opacity">
                <XCircle size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Section 1: Informations Personnelles */}
          <div className="lg:col-span-7">
            <section className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 md:p-10 shadow-2xl h-full">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <User size={20} />
                </div>
                <h3 className="text-xl font-black text-white tracking-tight">Identité Visuelle</h3>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-4">Nom complet</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input 
                      type="text" 
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-4">Adresse Email</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input 
                      type="email" 
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-primary text-white font-black text-[10px] uppercase tracking-widest py-5 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Mettre à jour le profil
                </button>
              </form>
            </section>
          </div>

          {/* Section 2: Sécurité & Mot de passe */}
          <div className="lg:col-span-5">
            <section className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 md:p-10 shadow-2xl h-full border-t-primary/20">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                  <Shield size={20} />
                </div>
                <h3 className="text-xl font-black text-white tracking-tight">Sécurité</h3>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-4">Ancien mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input 
                      type="password" 
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:border-primary/50 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-4">Nouveau mot de passe</label>
                  <div className="relative">
                    <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input 
                      type="password" 
                      value={passwordData.password}
                      onChange={(e) => setPasswordData({...passwordData, password: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:border-primary/50 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-4">Confirmation</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input 
                      type="password" 
                      value={passwordData.password_confirmation}
                      onChange={(e) => setPasswordData({...passwordData, password_confirmation: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:border-primary/50 transition-all"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-white text-black font-black text-[10px] uppercase tracking-widest py-5 rounded-2xl shadow-xl hover:bg-slate-200 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                  Changer le mot de passe
                </button>
              </form>
            </section>
          </div>

        </div>

        {/* Support Section */}
        <div className="mt-12 p-8 bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-[32px] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <Shield size={18} />
            </div>
            <p className="text-sm font-bold text-slate-300">Besoin d'aide pour sécuriser votre compte ?</p>
          </div>
          <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Contactez la Conciergerie VIP</button>
        </div>

      </div>
    </main>
  );
}

function XCircle({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}
