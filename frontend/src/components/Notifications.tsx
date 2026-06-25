"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle, Info, X, Trash2, ShieldAlert } from "lucide-react";
import { useEffect, useCallback } from "react";

/* ─────────────────────────────────────────────
   ConfirmDialog — replaces native confirm()
   ───────────────────────────────────────────── */

type ConfirmVariant = "danger" | "warning" | "info";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  onConfirm: () => void;
  onCancel: () => void;
}

const VARIANT_CONFIG: Record<ConfirmVariant, { icon: typeof AlertTriangle; iconBg: string; iconColor: string; btnBg: string }> = {
  danger: { icon: Trash2, iconBg: "bg-red-100", iconColor: "text-red-500", btnBg: "bg-red-600 hover:bg-red-700 focus:ring-red-500" },
  warning: { icon: ShieldAlert, iconBg: "bg-amber-100", iconColor: "text-amber-500", btnBg: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500" },
  info: { icon: Info, iconBg: "bg-blue-100", iconColor: "text-blue-500", btnBg: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500" },
};

export function ConfirmDialog({ open, title, message, confirmLabel = "Confirmer", cancelLabel = "Annuler", variant = "danger", onConfirm, onCancel }: ConfirmDialogProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onCancel();
    if (e.key === "Enter") onConfirm();
  }, [onCancel, onConfirm]);

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  const cfg = VARIANT_CONFIG[variant];
  const Icon = cfg.icon;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10"
          >
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl ${cfg.iconBg} flex items-center justify-center shrink-0`}>
                <Icon size={22} className={cfg.iconColor} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{message}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={onCancel}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-colors ${cfg.btnBg}`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────
   Toast-based helpers (premium styled)
   ───────────────────────────────────────────── */

import toast from "react-hot-toast";

const TOAST_STYLE: React.CSSProperties = {
  background: "#0f172a",
  color: "#fff",
  borderRadius: "14px",
  fontSize: "13px",
  fontWeight: 600,
  padding: "12px 20px",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 20px 40px -12px rgba(0,0,0,0.4)",
  maxWidth: "400px",
};

export function notifySuccess(message: string) {
  toast.success(message, {
    duration: 3500,
    style: TOAST_STYLE,
    iconTheme: { primary: "#22c55e", secondary: "#fff" },
  });
}

export function notifyError(message: string) {
  toast.error(message, {
    duration: 4500,
    style: TOAST_STYLE,
    iconTheme: { primary: "#ef4444", secondary: "#fff" },
  });
}

export function notifyInfo(message: string) {
  toast(message, {
    duration: 4000,
    icon: "💡",
    style: TOAST_STYLE,
  });
}
