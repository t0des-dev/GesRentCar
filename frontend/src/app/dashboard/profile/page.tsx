"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/modules/auth/context/context";
import { CheckCircle2, AlertCircle, Shield, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/shared/services/client";
import { cn } from "@/shared/utils";

// Modular Components
import ProfileHeaderNavigation from "@/modules/dashboard/components/profile/ProfileHeaderNavigation";
import PersonalInfoForm from "@/modules/dashboard/components/profile/PersonalInfoForm";
import SecuritySettingsForm from "@/modules/dashboard/components/profile/SecuritySettingsForm";

export default function ProfilePage() {
  const { user, refresh: update } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [profileData, setProfileData] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({ current_password: "", password: "", password_confirmation: "" });

  useEffect(() => {
    setMounted(true);
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || ""
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      await api.put("/user/profile", profileData);
      setMsg({ type: "success", text: "Votre profil a été mis à jour avec succès." });
      await update();
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
    <main className="min-h-screen bg-slate-950 text-white pt-28 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <ProfileHeaderNavigation />

        <AnimatePresence>
          {msg && (
            <motion.div
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className={cn(
                "p-4 rounded-xl mb-6 flex items-center gap-3 border",
                msg.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
              )}
            >
              {msg.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <p className="text-sm font-semibold">{msg.text}</p>
              <button onClick={() => setMsg(null)} className="ml-auto text-current opacity-40 hover:opacity-100 transition-opacity">
                <XCircle size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <PersonalInfoForm data={profileData} setData={setProfileData} onSubmit={handleUpdateProfile} loading={loading} />
          </div>
          <div className="lg:col-span-5">
            <SecuritySettingsForm data={passwordData} setData={setPasswordData} onSubmit={handleUpdatePassword} loading={loading} />
          </div>
        </div>

        <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
              <Shield size={16} />
            </div>
            <p className="text-sm text-slate-300">Besoin d'aide pour sécuriser votre compte ?</p>
          </div>
          <button className="text-[10px] font-semibold uppercase tracking-widest text-primary hover:underline">Contactez la Conciergerie VIP</button>
        </div>
      </div>
    </main>
  );
}
