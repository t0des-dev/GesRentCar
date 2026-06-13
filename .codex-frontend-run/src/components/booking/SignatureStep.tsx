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
    <div className="space-y-8">
      <div className="text-center max-w-lg mx-auto">
        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary border border-slate-100">
          <PenTool size={24} />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Validation <span className="text-primary">Juridique</span></h3>
        <p className="text-sm text-slate-500 leading-relaxed italic">
          Veuillez apposer votre signature ci-dessous.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-slate-100/80 rounded-3xl overflow-hidden shadow-sm">
          <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center px-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Shield size={12} className="text-primary" />
              Zone de signature sécurisée
            </span>
            <button 
              onClick={clear} 
              className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
              title="Effacer"
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

          <div className="bg-slate-50 p-3 text-center border-t border-slate-100">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Document Vectoria Rent Car • Certifié</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex gap-4">
          <button 
            onClick={onBack} 
            className="flex-1 py-5 rounded-2xl border border-slate-200 font-semibold uppercase text-xs tracking-wider text-slate-400 hover:bg-slate-50 transition-all"
          >
            Retour
          </button>
          <button 
            onClick={save} 
            disabled={!hasSignature}
            className="flex-[2] bg-slate-900 text-white py-5 rounded-2xl font-semibold uppercase text-xs tracking-wider shadow-sm hover:bg-primary active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-30"
          >
            Finaliser & Payer <CheckCircle2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
