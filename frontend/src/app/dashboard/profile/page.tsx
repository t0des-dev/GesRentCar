"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { CheckCircle2, AlertCircle, Shield, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api/client";
import { cn } from "@/lib/utils";

// Modular Components
import ProfileHeaderNavigation from "@/components/dashboard/profile/ProfileHeaderNavigation";
import PersonalInfoForm from "@/components/dashboard/profile/PersonalInfoForm";
import SecuritySettingsForm from "@/components/dashboard/profile/SecuritySettingsForm";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [profileData, setProfileData] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({ current_password: "", password: "", password_confirmation: "" });

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
      await api.put("/user/profile", profileData);
      setMsg({ type: "success", text: "Votre profil a été mis à jour avec succès." });
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
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/4 pointer-events-none" />
      
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <ProfileHeaderNavigation />

        <AnimatePresence>
          {msg && (
            <motion.div
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className={cn(
                "p-6 rounded-[24px] mb-8 flex items-center gap-4 border backdrop-blur-xl shadow-2xl",
                msg.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
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
          <div className="lg:col-span-7">
            <PersonalInfoForm data={profileData} setData={setProfileData} onSubmit={handleUpdateProfile} loading={loading} />
          </div>
          <div className="lg:col-span-5">
            <SecuritySettingsForm data={passwordData} setData={setPasswordData} onSubmit={handleUpdatePassword} loading={loading} />
          </div>
        </div>

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
