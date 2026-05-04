"use client";

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { PenTool, Trash2, CheckCircle2, RotateCcw } from "lucide-react";
import styles from "../../../app/search/[id]/page.module.css";

interface SignatureStepProps {
  onComplete: (signature: string) => void;
  onBack: () => void;
}

export default function SignatureStep({ onComplete, onBack }: SignatureStepProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [hasSignature, setHasSignature] = useState(false);

  const clear = () => {
    sigCanvas.current?.clear();
    setHasSignature(false);
  };

  const save = () => {
    if (sigCanvas.current?.isEmpty()) return;
    const dataUrl = sigCanvas.current?.getTrimmedCanvas().toDataURL("image/png");
    if (dataUrl) onComplete(dataUrl);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
      <div className="text-center">
        <h3 className="text-2xl font-black text-slate-900 mb-2">Signature Digitale</h3>
        <p className="text-slate-500 text-sm italic">Veuillez signer ci-dessous pour valider les conditions générales.</p>
      </div>

      <div className="relative group">
        <div className="absolute inset-0 bg-slate-100 rounded-[32px] -m-1 group-hover:bg-primary/10 transition-colors" />
        <div className="relative bg-white border-2 border-slate-200 rounded-[32px] overflow-hidden">
          <SignatureCanvas
            ref={sigCanvas}
            penColor="#0f172a"
            canvasProps={{ className: "w-full h-64 cursor-crosshair" }}
            onEnd={() => setHasSignature(true)}
          />
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button onClick={clear} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-500 hover:border-red-500 transition-all shadow-sm">
              <RotateCcw size={16} />
            </button>
          </div>
          <div className="absolute top-4 left-4 pointer-events-none opacity-20">
             <PenTool size={20} className="text-slate-400" />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button onClick={onBack} className="flex-1 py-5 rounded-[24px] border-2 border-slate-100 font-black uppercase text-xs tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Retour</button>
        <button 
          onClick={save} 
          disabled={!hasSignature}
          className="flex-[2] bg-slate-900 text-white py-5 rounded-[24px] font-black uppercase text-xs tracking-widest shadow-xl shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          Valider & Payer <CheckCircle2 size={18} />
        </button>
      </div>

      <p className="text-[10px] text-slate-400 text-center font-bold italic px-4">
        En signant, vous acceptez les conditions de location et autorisez Vectoria à procéder au prélèvement de l'acompte.
      </p>
    </div>
  );
}
