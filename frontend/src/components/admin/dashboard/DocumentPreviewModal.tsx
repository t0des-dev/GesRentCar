"use client";

import { XCircle, AlertTriangle } from "lucide-react";

interface DocumentPreviewModalProps {
  docs: { cin?: string; license?: string; name?: string } | null;
  onClose: () => void;
}

export default function DocumentPreviewModal({ docs, onClose }: DocumentPreviewModalProps) {
  if (!docs) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" onClick={onClose} />
      <div className="bg-white rounded-[40px] w-full max-w-4xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl flex flex-col animate-in zoom-in-95 duration-500 border border-white/20">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-2xl font-black text-slate-900">Documents : {docs.name}</h3>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Justificatifs d'identité et de conduite</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all">
            <XCircle size={24} className="text-slate-400" />
          </button>
        </div>
        
        <div className="p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-8 bg-white">
          {docs.cin && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Carte d'Identité (CIN)</span>
                <a href={`http://localhost:8000${docs.cin}`} target="_blank" rel="noopener noreferrer" className="text-primary font-black text-[10px] uppercase hover:underline">Ouvrir l'original</a>
              </div>
              <div className="aspect-video rounded-3xl overflow-hidden border-4 border-slate-100 shadow-inner group relative">
                <img src={`http://localhost:8000${docs.cin}`} alt="CIN" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
            </div>
          )}
          {docs.license && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Permis de Conduire</span>
                <a href={`http://localhost:8000${docs.license}`} target="_blank" rel="noopener noreferrer" className="text-primary font-black text-[10px] uppercase hover:underline">Ouvrir l'original</a>
              </div>
              <div className="aspect-video rounded-3xl overflow-hidden border-4 border-slate-100 shadow-inner group relative">
                <img src={`http://localhost:8000${docs.license}`} alt="Permis" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
            </div>
          )}
          {!docs.cin && !docs.license && (
            <div className="col-span-2 py-20 text-center text-slate-400">
              <AlertTriangle size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-bold">Aucun document numérisé pour ce client.</p>
            </div>
          )}
        </div>
        
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button onClick={onClose} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-primary transition-all">
            Fermer l'Aperçu
          </button>
        </div>
      </div>
    </div>
  );
}
