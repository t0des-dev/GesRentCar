"use client";

import { useState, useEffect } from "react";
import { 
  User as UserIcon, Lock, CreditCard, Bell, Shield, 
  Save, Loader2, Mail, Phone, ExternalLink, Key,
  CheckCircle2, AlertCircle, RefreshCw, Settings, Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api/client";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Form states
  const [profileForm, setProfileForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({ 
    current_password: "", 
    password: "", 
    password_confirmation: "" 
  });
  
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("vectoria_user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setProfileForm({ name: parsed.name, email: parsed.email });
    }
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.put("/user/profile", profileForm);
      localStorage.setItem("vectoria_user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      setMessage({ type: 'success', text: "Profil mis à jour avec succès !" });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || "Erreur lors de la mise à jour." });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await api.put("/user/password", passwordForm);
      setPasswordForm({ current_password: "", password: "", password_confirmation: "" });
      setMessage({ type: 'success', text: "Mot de passe modifié avec succès !" });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || "Erreur lors de la modification." });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Mon Profil", icon: UserIcon },
    { id: "security", label: "Sécurité", icon: Shield },
    { id: "payments", label: "Paiements", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "audit", label: "Journal d'Audit", icon: RefreshCw },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      {/* Sidebar Navigation */}
      <div className="lg:w-72 shrink-0 space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setMessage(null); }}
            className={cn(
              "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-sm",
              activeTab === tab.id 
                ? "bg-primary text-white shadow-lg shadow-primary/25" 
                : "text-slate-500 hover:bg-white hover:text-primary border border-transparent hover:border-slate-200"
            )}
          >
            <tab.icon size={18} strokeWidth={2.5} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 max-w-3xl">
        <AnimatePresence mode="wait">
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={cn(
                "mb-8 p-4 rounded-2xl border flex items-center gap-3 font-bold text-sm",
                message.type === 'success' 
                  ? "bg-green-50 border-green-100 text-green-700" 
                  : "bg-red-50 border-red-100 text-red-700"
              )}
            >
              {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white rounded-[40px] border border-slate-200/60 shadow-sm p-10">
          {activeTab === "profile" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Informations Personnelles</h2>
                <p className="text-slate-500 text-sm font-medium italic">Gérez votre identité sur la plateforme Vectoria.</p>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Nom complet</label>
                    <input 
                      type="text" 
                      value={profileForm.name}
                      onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:bg-white focus:border-primary transition-all font-bold outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Adresse Email</label>
                    <input 
                      type="email" 
                      value={profileForm.email}
                      onChange={e => setProfileForm({...profileForm, email: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:bg-white focus:border-primary transition-all font-bold outline-none" 
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                    disabled={loading}
                    className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-3 disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Enregistrer les modifications
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Sécurité du Compte</h2>
                <p className="text-slate-500 text-sm font-medium italic">Nous vous recommandons de changer votre mot de passe régulièrement.</p>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Mot de passe actuel</label>
                  <input 
                    type="password" 
                    required
                    value={passwordForm.current_password}
                    onChange={e => setPasswordForm({...passwordForm, current_password: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:bg-white focus:border-primary transition-all font-bold outline-none" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Nouveau mot de passe</label>
                    <input 
                      type="password" 
                      required
                      value={passwordForm.password}
                      onChange={e => setPasswordForm({...passwordForm, password: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:bg-white focus:border-primary transition-all font-bold outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Confirmer le mot de passe</label>
                    <input 
                      type="password" 
                      required
                      value={passwordForm.password_confirmation}
                      onChange={e => setPasswordForm({...passwordForm, password_confirmation: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:bg-white focus:border-primary transition-all font-bold outline-none" 
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                    disabled={loading}
                    className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-slate-900/10 hover:scale-105 transition-all flex items-center gap-3 disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                    Mettre à jour le mot de passe
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === "payments" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 mb-2">Passerelles de Paiement</h2>
                  <p className="text-slate-500 text-sm font-medium italic">Configurez vos intégrations Stripe et CMI Maroc.</p>
                </div>
                <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-primary transition-colors">
                  <RefreshCw size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Stripe Card */}
                <div className="p-8 rounded-[32px] border-2 border-slate-100 bg-slate-50/30 group hover:border-primary/20 transition-all duration-500">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#635BFF] flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <CreditCard size={28} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-black text-lg text-slate-900">Stripe Payments</h4>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-green-600">Connecté • Mode Test</span>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      v2.4.0
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-8 opacity-60 grayscale pointer-events-none">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Publishable Key</label>
                      <div className="relative">
                        <input type="password" value="pk_test_************************" disabled className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-mono text-xs" />
                        <Key size={14} className="absolute right-4 top-3.5 text-slate-300" />
                      </div>
                    </div>
                  </div>

                  <button className="w-full py-4 bg-white border-2 border-slate-200 rounded-2xl font-black uppercase text-xs tracking-widest text-slate-600 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
                    <Settings size={16} />
                    Configurer les clés API
                  </button>
                </div>

                {/* CMI Card */}
                <div className="p-8 rounded-[32px] border border-slate-200 bg-white group hover:border-secondary/30 transition-all duration-500">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <Globe size={28} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-black text-lg text-slate-900">CMI Maroc</h4>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-slate-300" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Non configuré</span>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                      Coming soon
                    </div>
                  </div>
                  
                  <button className="w-full py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black uppercase text-xs tracking-widest text-slate-300 cursor-not-allowed">
                    Configurer le compte marchand
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Centre de Notifications</h2>
                <p className="text-slate-500 text-sm font-medium italic">Gérez la communication avec vos clients.</p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: Mail, label: "Confirmations d'Email", desc: "Envoi automatique après réservation", enabled: true, color: "bg-blue-50 text-blue-600" },
                  { icon: Phone, label: "Alertes WhatsApp", desc: "Notification temps-réel via Twilio API", enabled: false, color: "bg-green-50 text-green-600" },
                  { icon: Lock, label: "Contrats Signés", desc: "Envoi automatique du PDF signé par email", enabled: true, color: "bg-purple-50 text-purple-600" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-6 rounded-3xl border border-slate-100 hover:border-primary/20 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", item.color)}>
                        <item.icon size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{item.label}</h4>
                        <p className="text-xs text-slate-400 font-medium italic">{item.desc}</p>
                      </div>
                    </div>
                    <div className={cn(
                      "w-12 h-6 rounded-full p-1 cursor-pointer transition-all duration-300",
                      item.enabled ? "bg-primary" : "bg-slate-200"
                    )}>
                      <div className={cn(
                        "w-4 h-4 rounded-full bg-white transition-all duration-300 transform",
                        item.enabled ? "translate-x-6" : "translate-x-0"
                      )} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 rounded-[32px] bg-slate-900 text-white flex items-center justify-between overflow-hidden relative">
                <div className="relative z-10">
                  <h4 className="font-black text-lg mb-1 italic">API WhatsApp Business</h4>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">Nécessite un compte Twilio certifié</p>
                  <button className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-white transition-all">
                    Demander l'activation
                    <ExternalLink size={12} />
                  </button>
                </div>
                <Phone size={120} className="absolute -right-8 -bottom-8 text-white/5 rotate-12" />
              </div>
            </motion.div>
          )}

          {activeTab === "audit" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Journal d'Audit</h2>
                <p className="text-slate-500 text-sm font-medium italic">Suivez les activités administratives pour une sécurité accrue.</p>
              </div>

              <div className="border border-slate-100 rounded-3xl overflow-hidden bg-slate-50/30">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-white border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Utilisateur</th>
                      <th className="px-6 py-4">Action</th>
                      <th className="px-6 py-4 text-right">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {[
                      { user: "Sami El Fassi", action: "Mise à jour des prix SUV", status: "Success" },
                      { user: "Admin Victoria", action: "Nouvel agent ajouté (Idriss)", status: "Success" },
                      { user: "Sami El Fassi", action: "Tentative de connexion échouée", status: "Warning" },
                    ].map((log, idx) => (
                      <tr key={idx} className="hover:bg-white transition-colors group">
                        <td className="px-6 py-4 font-bold text-slate-700">{log.user}</td>
                        <td className="px-6 py-4 text-slate-500 font-medium">{log.action}</td>
                        <td className="px-6 py-4 text-right">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                            log.status === "Success" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                          )}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
