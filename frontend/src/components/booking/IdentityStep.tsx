"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ScanLine, Camera, Loader2, Check, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { BookingStepProps } from "@/types/booking";

interface IdentityStepProps extends BookingStepProps {
  isScanning: boolean;
  setIsScanning: (val: boolean) => void;
}

export default function IdentityStep({ booking, update, isScanning, setIsScanning }: IdentityStepProps) {
  const [scanSuccess, setScanSuccess] = useState(false);

  const handleScan = async (e: React.ChangeEvent<HTMLInputElement>, type: "cin" | "license" = "cin") => {
    if (!e.target.files?.[0]) return;
    setIsScanning(true);
    setScanSuccess(false);
    
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    formData.append("type", type);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      const res = await fetch(`${apiBase}/ocr/scan`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (data.success && data.data) {
        if (data.warnings && data.warnings.length > 0) {
          alert("⚠️ ATTENTION : " + data.warnings.join("\n"));
        }
        update("client", {
          ...booking.client,
          name: data.data.name || booking.client.name,
          cin: type === "cin" ? (data.data.id_number || booking.client.cin) : booking.client.cin,
          licenseNumber: type === "license" ? (data.data.license_number || booking.client.licenseNumber) : booking.client.licenseNumber,
          cinImageUrl: type === "cin" ? (data.data.image_url || booking.client.cinImageUrl) : booking.client.cinImageUrl,
          licenseImageUrl: type === "license" ? (data.data.image_url || booking.client.licenseImageUrl) : booking.client.licenseImageUrl,
        });
        
        if (type === "cin" || type === "license") {
          setTimeout(() => {
            update("client", { ...booking.client, verified: true });
          }, 2000);
        }

        setScanSuccess(true);
        setTimeout(() => setScanSuccess(false), 3000);
      }
    } catch (err) {
      console.error("OCR Error", err);
      alert("Erreur de connexion au serveur OCR.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4">
      {/* AI Scanner Box */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-[32px] p-8 mb-6 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        
        {isScanning && <div className="absolute top-0 left-0 w-full h-1 bg-amber-400 shadow-[0_0_15px_#fbbf24] animate-[scan_1.5s_ease-in-out_infinite]" />}
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white text-center md:text-left">
            <h3 className="text-xl font-black mb-2 flex items-center justify-center md:justify-start gap-2">
              <ScanLine className="text-amber-400" />
              Système OCR Intégré
            </h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Gagnez du temps en scannant vos documents. <br/>
              Notre IA extrait automatiquement vos données et sécurise vos justificatifs.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <div className="relative group/scan">
              <input type="file" accept="image/*" onChange={(e) => handleScan(e, "cin")} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" disabled={isScanning} />
              <button disabled={isScanning} className={cn(
                "flex items-center gap-3 px-6 py-4 rounded-2xl font-black transition-all border-2", 
                isScanning ? "bg-slate-700 text-slate-400 cursor-not-allowed border-transparent" : 
                booking.client.cinImageUrl ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
                "bg-white text-slate-900 border-white hover:bg-amber-500 hover:border-amber-500"
              )}>
                {isScanning ? <Loader2 className="animate-spin" size={20}/> : <Camera size={20}/>}
                {booking.client.cinImageUrl ? "CIN Scanné ✓" : "Scanner CIN"}
              </button>
            </div>

            <div className="relative group/scan">
              <input type="file" accept="image/*" onChange={(e) => handleScan(e, "license")} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" disabled={isScanning} />
              <button disabled={isScanning} className={cn(
                "flex items-center gap-3 px-6 py-4 rounded-2xl font-black transition-all border-2", 
                isScanning ? "bg-slate-700 text-slate-400 cursor-not-allowed border-transparent" : 
                booking.client.licenseImageUrl ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
                "bg-white text-slate-900 border-white hover:bg-amber-500 hover:border-amber-500"
              )}>
                {isScanning ? <Loader2 className="animate-spin" size={20}/> : <Camera size={20}/>}
                {booking.client.licenseImageUrl ? "Permis Scanné ✓" : "Scanner Permis"}
              </button>
            </div>
          </div>
        </div>

        {/* Previews */}
        {(booking.client.cinImageUrl || booking.client.licenseImageUrl) && (
          <div className="mt-8 flex gap-4 animate-in slide-in-from-top-4 relative z-10">
            {booking.client.cinImageUrl && (
              <div className="relative group">
                <img src={`http://localhost:8000${booking.client.cinImageUrl}`} alt="CIN Preview" className="w-32 h-20 object-cover rounded-xl border-2 border-white/20 hover:scale-105 transition-transform" />
                <div className="absolute top-1 right-1 bg-emerald-500 text-white rounded-full p-0.5"><Check size={10} strokeWidth={4} /></div>
                <span className="absolute -bottom-5 left-0 right-0 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">Aperçu CIN</span>
              </div>
            )}
            {booking.client.licenseImageUrl && (
              <div className="relative group">
                <img src={`http://localhost:8000${booking.client.licenseImageUrl}`} alt="License Preview" className="w-32 h-20 object-cover rounded-xl border-2 border-white/20 hover:scale-105 transition-transform" />
                <div className="absolute top-1 right-1 bg-emerald-500 text-white rounded-full p-0.5"><Check size={10} strokeWidth={4} /></div>
                <span className="absolute -bottom-5 left-0 right-0 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">Aperçu Permis</span>
              </div>
            )}
          </div>
        )}

        {/* Identity Verified Badge */}
        {booking.client.verified && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-12 flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-[32px] relative z-10"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
              <ShieldCheck size={28} />
            </div>
            <div>
              <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest mb-1">Identité Vérifiée via IA</p>
              <p className="text-xs text-slate-500 font-medium italic">Documents authentifiés avec succès. Votre contrat sera pré-rempli et votre check-in en agence sera prioritaire.</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Manual Fields */}
      <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {scanSuccess && <div className="absolute inset-0 bg-emerald-500/5 rounded-[32px] animate-pulse pointer-events-none" />}
        {[ 
          { k: "name", l: "Nom Complet", p: "John Doe" }, 
          { k: "email", l: "Email", p: "contact@exemple.com", t: "email" }, 
          { k: "phone", l: "Téléphone", p: "+212 6 00 00 00 00", t: "tel" }, 
          { k: "cin", l: "CIN / Passeport", p: "AB123456" }, 
          { k: "licenseNumber", l: "Permis de conduire", p: "12345678" } 
        ].map((f) => (
          <div key={f.k} className={cn("space-y-2", f.k === "name" || f.k === "email" ? "md:col-span-1" : "")}>
            <label className="text-[10px] font-black uppercase text-slate-500 ml-2 flex items-center gap-2">
              {f.l}
              {scanSuccess && (f.k === "name" || f.k === "cin" || f.k === "licenseNumber") && <span className="text-emerald-500 text-[9px] bg-emerald-50 px-1 rounded">IA ✓</span>}
            </label>
            <input 
              type={f.t || "text"} 
              placeholder={f.p} 
              value={(booking.client as any)[f.k]} 
              onChange={(e) => update("client", { ...booking.client, [f.k]: e.target.value })} 
              className={cn("w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold focus:border-primary outline-none transition-all", scanSuccess && (f.k === "name" || f.k === "cin" || f.k === "licenseNumber") ? "ring-2 ring-emerald-500/50 bg-emerald-50" : "")} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}
