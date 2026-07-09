"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Mail, CheckCircle, X, Loader2 } from "lucide-react";
import { cn } from "@/shared/utils";

interface WaitlistButtonProps {
  vehicleId: number;
  vehicleName: string;
}

export default function WaitlistButton({ vehicleId, vehicleName }: WaitlistButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
    }, 1000);
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
          <CheckCircle size={18} className="text-emerald-600" />
        </div>
        <div>
          <p className="font-bold text-emerald-800 text-sm">Inscrit !</p>
          <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">
            Nous vous notifierons quand {vehicleName} sera disponible
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 bg-surface-1 border border-border rounded-2xl px-4 py-3 text-xs font-bold text-ink-2 uppercase tracking-widest hover:bg-surface-2 hover:border-primary/20 transition-all"
      >
        <Bell size={14} className="text-primary" />
        Me prévenir quand disponible
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-ink-1/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-ink-3 hover:text-ink-2 hover:bg-surface-2 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Bell size={22} className="text-primary" />
              </div>

              <h3 className="font-bold text-ink-1 uppercase tracking-wider text-sm mb-1">Liste d&apos;attente</h3>
              <p className="text-[10px] text-ink-3 font-bold uppercase tracking-widest mb-4">
                {vehicleName} — Nous vous envoyons un email dès qu&apos;il est disponible
              </p>

              <form onSubmit={handleJoin} className="space-y-3">
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full pl-9 pr-4 py-2.5 bg-surface-1 border border-border rounded-xl text-xs text-ink-1 placeholder:text-ink-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    autoFocus
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Inscription...
                    </>
                  ) : (
                    "M&apos;inscrire"
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
