"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ScanLine, Camera, Loader2, ShieldCheck, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* AI Scanner Box */}
      <div className="bg-slate-900 rounded-[56px] p-12 shadow-[0_40px_100px_rgba(0,0,0,0.2)] relative overflow-hidden group">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-blue-600/5" />
        
        {isScanning && (
          <motion.div 
            initial={{ top: "0%" }}
            animate={{ top: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 w-full h-1 bg-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.8)] z-20"
          />
        )}
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-md text-center lg:text-left">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
              <ScanLine size={16} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">IA Smart Verification</span>
            </div>
            <h3 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase">
              Vérification <span className="text-primary">Instantanée</span>
            </h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Utilisez notre technologie OCR pour extraire vos données en un éclair. 
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6">
            {[
              { type: "cin", label: "Scanner CIN", icon: FileText, field: "cinImageUrl" },
              { type: "license", label: "Scanner Permis", icon: Camera, field: "licenseImageUrl" }
            ].map((scanner) => (
              <div key={scanner.type} className="relative group/btn">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleScan(e, scanner.type as any)} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                  disabled={isScanning} 
                />
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "flex flex-col items-center gap-4 px-10 py-8 rounded-[32px] font-black transition-all border-2 text-center min-w-[200px]", 
                    isScanning ? "bg-slate-800 text-slate-500 border-transparent cursor-not-allowed" : 
                    (booking.client as any)[scanner.field] ? "bg-emerald-500 text-white border-emerald-400 shadow-xl shadow-emerald-500/20" : 
                    "bg-white text-slate-900 border-white hover:border-primary/50"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                    (booking.client as any)[scanner.field] ? "bg-white/20" : "bg-slate-50"
                  )}>
                    {isScanning ? <Loader2 className="animate-spin" size={24}/> : <scanner.icon size={24}/>}
                  </div>
                  <span className="text-[10px] uppercase tracking-widest">
                    {(booking.client as any)[scanner.field] ? `${scanner.label} OK` : scanner.label}
                  </span>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Identity Verified Badge */}
        <AnimatePresence>
          {booking.client.verified && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-12 flex items-center gap-6 bg-white/5 border border-white/10 p-8 rounded-[40px] relative z-10 backdrop-blur-md"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] shrink-0">
                <ShieldCheck size={32} />
              </div>
              <div>
                <p className="text-xs font-black text-emerald-400 uppercase tracking-[0.4em] mb-2">Identité Authentifiée</p>
                <p className="text-xs text-slate-400 font-medium italic leading-relaxed">
                  Vos documents ont été validés par notre système.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Manual Fields */}
      <div className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.02)] grid grid-cols-1 md:grid-cols-2 gap-8 relative">
        <div className="md:col-span-2 mb-4">
          <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase">Informations Personnelles</h4>
          <p className="text-xs text-slate-400 font-medium mt-1">Veuillez vérifier ou compléter les champs ci-dessous.</p>
        </div>
        
        {[ 
          { k: "name", l: "Nom Complet", p: "Ex: John Doe" }, 
          { k: "email", l: "Adresse Email", p: "Ex: contact@premium.com", t: "email" }, 
          { k: "phone", l: "Téléphone Mobile", p: "Ex: +212 6 00 00 00 00", t: "tel" }, 
          { k: "cin", l: "Numéro CIN / Passeport", p: "Ex: AB123456" }, 
          { k: "licenseNumber", l: "Numéro de Permis", p: "Ex: 12345678", span: "md:col-span-2" } 
        ].map((f) => (
          <div key={f.k} className={cn("space-y-3", f.span || "")}>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 flex items-center gap-3">
              {f.l}
              {scanSuccess && (f.k === "name" || f.k === "cin" || f.k === "licenseNumber") && 
                <span className="text-emerald-500 text-[8px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">EXTRAIT PAR IA</span>
              }
            </label>
            <input 
              type={f.t || "text"} 
              placeholder={f.p} 
              value={(booking.client as any)[f.k]} 
              onChange={(e) => update("client", { ...booking.client, [f.k]: e.target.value })} 
              className={cn(
                "w-full bg-slate-50 border-2 border-slate-50 rounded-3xl px-8 py-5 font-black text-slate-900 focus:bg-white focus:border-primary/20 outline-none transition-all duration-300 placeholder:text-slate-300", 
                scanSuccess && (f.k === "name" || f.k === "cin" || f.k === "licenseNumber") ? "bg-emerald-50/30 border-emerald-100" : ""
              )} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}
