"use client";

import { useState } from "react";
import { cn } from "@/shared/utils";
import { Tag, Loader2, Check, X } from "lucide-react";

interface PromoCodeInputProps {
  onApply: (code: string) => Promise<{ valid: boolean; discount?: number; message?: string }>;
  className?: string;
}

export default function PromoCodeInput({ onApply, className }: PromoCodeInputProps) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleApply = async () => {
    if (!code.trim()) return;
    setStatus("loading");
    try {
      const result = await onApply(code.trim());
      if (result.valid) {
        setStatus("success");
        setMessage(result.message || `Réduction de ${result.discount} DH appliquée !`);
      } else {
        setStatus("error");
        setMessage(result.message || "Code promo invalide");
      }
    } catch {
      setStatus("error");
      setMessage("Erreur lors de la vérification");
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-3">
        <Tag size={12} className="text-gold" /> Code promo
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => { setCode(e.target.value.toUpperCase()); setStatus("idle"); }}
          placeholder="ENTRER LE CODE"
          className="input-premium flex-1 text-sm tracking-widest font-mono uppercase"
          disabled={status === "success"}
        />
        <button
          onClick={handleApply}
          disabled={!code.trim() || status === "loading" || status === "success"}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
            status === "success"
              ? "bg-emerald-500 text-white"
              : "bg-ink-1 text-white hover:bg-ink-2 disabled:opacity-40"
          )}
        >
          {status === "loading" ? <Loader2 size={14} className="animate-spin" /> :
           status === "success" ? <Check size={14} /> :
           "Appliquer"}
        </button>
        {status === "success" && (
          <button onClick={() => { setCode(""); setStatus("idle"); setMessage(""); }} className="p-2 text-ink-3 hover:text-red-500 transition-colors">
            <X size={14} />
          </button>
        )}
      </div>
      {message && (
        <p className={cn("text-xs font-semibold", status === "success" ? "text-emerald-500" : "text-red-500")}>
          {message}
        </p>
      )}
    </div>
  );
}
