"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Smartphone } from "lucide-react";
import { cn } from "@/shared/utils";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsStandalone(
      window.matchMedia("(display-mode: standalone)").matches
      || (window.navigator as Navigator & { standalone?: boolean }).standalone === true
    );
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const onInstalled = () => {
      setInstalled(true);
      setVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", onInstalled);

    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (isMobile) {
      timer = setTimeout(() => setVisible(true), 5000);
    }

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setInstalled(true);
      setVisible(false);
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    setDeferredPrompt(null);
  }, []);

  if (isStandalone || installed || !visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink-1/40 backdrop-blur-sm"
            onClick={handleDismiss}
          />

          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "relative w-full max-w-sm mx-4 mb-0 sm:mb-0 p-6",
              "bg-surface-0/80 backdrop-blur-xl border border-border rounded-t-3xl sm:rounded-3xl",
              "shadow-2xl shadow-ink-1/20"
            )}
          >
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-1 border border-border flex items-center justify-center text-ink-3 hover:text-ink-1 hover:border-gold transition-all"
              aria-label="Fermer"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 flex items-center justify-center">
                <Smartphone size={28} className="text-gold" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink-1 tracking-tight">Installer Vectoria</h3>
                <p className="text-xs text-ink-3 font-medium">Accès rapide depuis votre écran d&apos;accueil</p>
              </div>
            </div>

            <p className="text-sm text-ink-2 mb-6 leading-relaxed">
              Installez l&apos;application Vectoria pour une expérience plus rapide et des notifications exclusives.
            </p>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDismiss}
                className="flex-1 h-12 rounded-xl border-2 border-border bg-surface-1 text-ink-3 text-xs font-bold uppercase tracking-wider hover:border-ink-3/30 transition-all"
              >
                Plus tard
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleInstall}
                className="flex-1 h-12 rounded-xl bg-gradient-to-r from-gold to-gold/90 text-ink-1 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-gold/30 hover:shadow-xl hover:shadow-gold/40 transition-all"
              >
                <Download size={16} strokeWidth={2.5} />
                Installer
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
