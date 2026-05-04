"use client";

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { PenTool, CheckCircle2, RotateCcw, Shield } from "lucide-react";

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
    console.log("Saving signature...", typeof onComplete);
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
    <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="text-center max-w-lg mx-auto">
        <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 text-primary shadow-xl">
          <PenTool size={28} />
        </div>
        <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter uppercase">Validation <span className="text-primary">Juridique</span></h3>
        <p className="text-slate-400 text-sm font-medium leading-relaxed italic">
          Veuillez apposer votre signature ci-dessous.
        </p>
      </div>

      <div className="relative group max-w-2xl mx-auto">
        <div className="absolute -inset-1 bg-gradient-to-r from-slate-100 to-slate-200 rounded-[48px] blur-sm group-hover:blur-md transition-all opacity-50" />
        <div className="relative bg-white border-2 border-slate-100 rounded-[48px] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.05)]">
          <div className="bg-slate-50/50 p-4 border-b border-slate-100 flex justify-between items-center px-8">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
              <Shield size={12} className="text-primary" />
              Zone de signature sécurisée
            </span>
            <button 
              onClick={clear} 
              className="p-2 text-slate-300 hover:text-red-500 transition-colors"
              title="Effacer"
            >
              <RotateCcw size={18} />
            </button>
          </div>
          
          <div className="relative h-72 bg-white">
            <SignatureCanvas
              ref={sigCanvas}
              penColor="#0f172a"
              canvasProps={{ className: "w-full h-full cursor-crosshair" }}
              onEnd={() => setHasSignature(true)}
            />
          </div>

          <div className="bg-slate-900 p-3 text-center">
            <p className="text-[8px] text-white/40 font-black uppercase tracking-[0.5em]">Document Vectoria Rent Car • Certifié</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex gap-6">
          <button 
            onClick={onBack} 
            className="flex-1 py-6 rounded-[32px] border-2 border-slate-100 font-black uppercase text-[10px] tracking-[0.2em] text-slate-400 hover:bg-slate-50 transition-all"
          >
            Retour
          </button>
          <button 
            onClick={save} 
            disabled={!hasSignature}
            className="flex-[2] bg-slate-900 text-white py-6 rounded-[32px] font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl shadow-slate-900/30 hover:bg-primary hover:shadow-primary/40 active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-30"
          >
            Finaliser & Payer <CheckCircle2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
