"use client";

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { PenTool, CheckCircle2, RotateCcw, Shield } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";

interface SignatureStepProps {
  onComplete: (signature: string) => void;
  onBack: () => void;
}

export default function SignatureStep({ onComplete, onBack }: SignatureStepProps) {
  const { t } = useTranslation();
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [hasSignature, setHasSignature] = useState(false);

  const clear = () => {
    sigCanvas.current?.clear();
    setHasSignature(false);
  };

  const save = () => {
    if (sigCanvas.current?.isEmpty()) return;
    const dataUrl = sigCanvas.current?.getTrimmedCanvas().toDataURL("image/png");
    if (dataUrl) {
      if (typeof onComplete === 'function') {
        onComplete(dataUrl);
      } else {
        console.error("onComplete is not a function!", onComplete);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center max-w-lg mx-auto">
        <div className="w-14 h-14 bg-surface-1 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary border border-border">
          <PenTool size={24} />
        </div>
        <h3 className="text-2xl font-bold text-ink-1 mb-3 tracking-tight">{t("signature_title")} <span className="text-primary">{t("signature_accent")}</span></h3>
        <p className="text-sm text-ink-2 leading-relaxed italic">
          {t("signature_desc")}
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-surface-0 border border-border/80 rounded-3xl overflow-hidden shadow-sm">
          <div className="bg-surface-1 p-4 border-b border-border flex justify-between items-center px-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-3 flex items-center gap-2">
              <Shield size={12} className="text-primary" />
              {t("signature_secure_zone")}
            </span>
            <button 
              onClick={clear} 
              className="p-1.5 text-ink-4 hover:text-red-500 transition-colors"
              title={t("signature_clear")}
            >
              <RotateCcw size={16} />
            </button>
          </div>
          
          <div className="relative h-64">
            <SignatureCanvas
              ref={sigCanvas}
              penColor="#0f172a"
              canvasProps={{ className: "w-full h-full cursor-crosshair" }}
              onEnd={() => setHasSignature(true)}
            />
          </div>

          <div className="bg-surface-1 p-3 text-center border-t border-border">
            <p className="text-xs text-ink-3 font-medium uppercase tracking-wider">{t("signature_certified")}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex gap-4">
          <button 
            onClick={onBack} 
            className="flex-1 py-5 rounded-2xl border border-border font-semibold uppercase text-xs tracking-wider text-ink-3 hover:bg-surface-1 transition-all"
          >
            {t("booking_prev_button")}
          </button>
          <button 
            onClick={save} 
            disabled={!hasSignature}
            className="flex-[2] bg-primary text-primary-foreground py-5 rounded-2xl font-semibold uppercase text-xs tracking-wider shadow-sm hover:bg-primary active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-30"
          >
            {t("signature_finalize")} <CheckCircle2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
