"use client";

import { motion } from "framer-motion";
import { CreditCard, Globe, RefreshCw, Settings, Key, Mail, Phone, Lock, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export function PaymentSettings() {
  return (
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
          </div>
          <button className="w-full py-4 bg-white border-2 border-slate-200 rounded-2xl font-black uppercase text-xs tracking-widest text-slate-600 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
            <Settings size={16} /> Configurer les clés API
          </button>
        </div>
        
        <div className="p-8 rounded-[32px] border border-slate-200 bg-white group hover:border-secondary/30 transition-all duration-500 opacity-80">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Globe size={28} className="text-white" />
              </div>
              <div>
                <h4 className="font-black text-lg text-slate-900">CMI Maroc</h4>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Coming soon</span>
              </div>
            </div>
          </div>
          <button className="w-full py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black uppercase text-xs tracking-widest text-slate-300 cursor-not-allowed">
            Configurer le compte marchand
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function NotificationSettings() {
  return (
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
            <div className={cn("w-12 h-6 rounded-full p-1 cursor-pointer transition-all duration-300", item.enabled ? "bg-primary" : "bg-slate-200")}>
              <div className={cn("w-4 h-4 rounded-full bg-white transition-all duration-300 transform", item.enabled ? "translate-x-6" : "translate-x-0")} />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function AuditLogSettings() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Journal d'Audit</h2>
        <p className="text-slate-500 text-sm font-medium italic">Suivez les activités administratives pour une sécurité accrue.</p>
      </div>

      <div className="border border-slate-100 rounded-3xl overflow-hidden bg-slate-50/30">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-white border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <tr><th className="px-6 py-4">Utilisateur</th><th className="px-6 py-4">Action</th><th className="px-6 py-4 text-right">Statut</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {[
              { user: "Sami El Fassi", action: "Mise à jour des prix SUV", status: "Success" },
              { user: "Admin Victoria", action: "Nouvel agent ajouté (Idriss)", status: "Success" },
              { user: "Sami El Fassi", action: "Tentative de connexion échouée", status: "Warning" },
            ].map((log, idx) => (
              <tr key={idx} className="hover:bg-white transition-colors">
                <td className="px-6 py-4 font-bold text-slate-700">{log.user}</td>
                <td className="px-6 py-4 text-slate-500 font-medium">{log.action}</td>
                <td className="px-6 py-4 text-right">
                  <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", log.status === "Success" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600")}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
