"use client";

import { motion } from "framer-motion";
import { CreditCard, Globe, RefreshCw, Settings, Key, Mail, Phone, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export function PaymentSettings() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif text-ink-1 mb-2">Passerelles de Paiement</h2>
          <p className="text-ink-2 text-sm font-bold italic">Configurez vos intégrations Stripe et CMI Maroc.</p>
        </div>
        <motion.button
          whileHover={{ rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          className="p-3 bg-surface-1 rounded-xl text-ink-3 hover:text-gold transition-colors"
        >
          <RefreshCw size={18} />
        </motion.button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card-premium p-8 group"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#635BFF] flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <CreditCard size={28} className="text-white" />
              </div>
              <div>
                <h4 className="font-serif text-lg text-ink-1">Stripe Payments</h4>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-green-600">Connecté • Mode Test</span>
                </div>
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-surface-1 border-2 border-border rounded-2xl font-bold uppercase text-xs tracking-wider text-ink-2 hover:text-gold hover:border-gold/40 transition-all flex items-center justify-center gap-2"
          >
            <Settings size={16} /> Configurer les clés API
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="card-premium p-8 opacity-80"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Globe size={28} className="text-white" />
              </div>
              <div>
                <h4 className="font-serif text-lg text-ink-1">CMI Maroc</h4>
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-3 italic">Coming soon</span>
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled
            className="w-full py-4 bg-surface-1 border-2 border-border rounded-2xl font-bold uppercase text-xs tracking-wider text-ink-3 cursor-not-allowed"
          >
            Configurer le compte marchand
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function NotificationSettings() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif text-ink-1 mb-2">Centre de Notifications</h2>
        <p className="text-ink-2 text-sm font-bold italic">Gérez la communication avec vos clients.</p>
      </div>

      <div className="space-y-4">
        {[
          { icon: Mail, label: "Confirmations d'Email", desc: "Envoi automatique après réservation", enabled: true, color: "bg-blue-50 text-blue-600" },
          { icon: Phone, label: "Alertes WhatsApp", desc: "Notification temps-réel via Twilio API", enabled: false, color: "bg-green-50 text-green-600" },
          { icon: Lock, label: "Contrats Signés", desc: "Envoi automatique du PDF signé par email", enabled: true, color: "bg-purple-50 text-purple-600" },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="card-premium p-6 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", item.color)}>
                <item.icon size={20} />
              </div>
              <div>
                <h4 className="font-bold text-ink-1">{item.label}</h4>
                <p className="text-xs text-ink-3 font-bold italic">{item.desc}</p>
              </div>
            </div>
            <div className={cn("w-12 h-6 rounded-full p-1 cursor-pointer transition-all duration-300", item.enabled ? "bg-gold" : "bg-border")}>
              <div className={cn("w-4 h-4 rounded-full bg-white transition-all duration-300 transform", item.enabled ? "translate-x-6" : "translate-x-0")} />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export function AuditLogSettings() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif text-ink-1 mb-2">Journal d'Audit</h2>
        <p className="text-ink-2 text-sm font-bold italic">Suivez les activités administratives pour une sécurité accrue.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-premium p-0 overflow-hidden"
      >
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-surface-1 border-b-2 border-border text-[10px] font-bold uppercase tracking-wider text-ink-3">
            <tr><th className="px-6 py-4">Utilisateur</th><th className="px-6 py-4">Action</th><th className="px-6 py-4 text-right">Statut</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[
              { user: "Sami El Fassi", action: "Mise à jour des prix SUV", status: "Success" },
              { user: "Admin Victoria", action: "Nouvel agent ajouté (Idriss)", status: "Success" },
              { user: "Sami El Fassi", action: "Tentative de connexion échouée", status: "Warning" },
            ].map((log, idx) => (
              <tr key={idx} className="hover:bg-surface-1 transition-colors">
                <td className="px-6 py-4 font-bold text-ink-1">{log.user}</td>
                <td className="px-6 py-4 text-ink-2 font-bold">{log.action}</td>
                <td className="px-6 py-4 text-right">
                  <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", log.status === "Success" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600")}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
}
