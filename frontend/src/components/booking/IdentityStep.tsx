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
    <div className="space-y-8">
      {/* AI Scanner Box */}
      <div className="bg-slate-50 rounded-3xl p-10 border border-slate-100/80 relative overflow-hidden">
        {isScanning && (
          <motion.div 
            initial={{ top: "0%" }}
            animate={{ top: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 w-full h-0.5 bg-primary z-20"
          />
        )}
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-md text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary mb-4">
              <ScanLine size={14} />
              <span className="text-xs font-semibold uppercase tracking-wider">IA Smart Verification</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
              Vérification <span className="text-primary">Instantanée</span>
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Utilisez notre technologie OCR pour extraire vos données en un éclair. 
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {[
              { type: "cin", label: "Scanner CIN", icon: FileText, field: "cinImageUrl" },
              { type: "license", label: "Scanner Permis", icon: Camera, field: "licenseImageUrl" }
            ].map((scanner) => (
              <div key={scanner.type} className="relative group">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleScan(e, scanner.type as any)} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                  disabled={isScanning} 
                />
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex flex-col items-center gap-3 px-8 py-6 rounded-2xl font-semibold transition-all border text-center min-w-[180px]", 
                    isScanning ? "bg-slate-200 text-slate-500 border-transparent cursor-not-allowed" : 
                    (booking.client as any)[scanner.field] ? "bg-emerald-500 text-white border-emerald-400" : 
                    "bg-white text-slate-900 border-slate-200 hover:border-primary/50"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                    (booking.client as any)[scanner.field] ? "bg-white/20" : "bg-slate-50"
                  )}>
                    {isScanning ? <Loader2 className="animate-spin" size={20}/> : <scanner.icon size={20}/>}
                  </div>
                  <span className="text-xs uppercase tracking-wider">
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
              className="mt-8 flex items-center gap-4 bg-white border border-slate-100 p-6 rounded-2xl relative z-10"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Identité Authentifiée</p>
                <p className="text-sm text-slate-500 italic">
                  Vos documents ont été validés par notre système.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Manual Fields */}
      <div className="bg-white p-10 rounded-3xl border border-slate-100/80 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        <div className="md:col-span-2 mb-2">
          <h4 className="text-xl font-bold text-slate-900 tracking-tight">Informations Personnelles</h4>
          <p className="text-sm text-slate-400 mt-1">Veuillez vérifier ou compléter les champs ci-dessous.</p>
        </div>
        
        {[ 
          { k: "name", l: "Nom Complet", p: "Ex: John Doe" }, 
          { k: "email", l: "Adresse Email", p: "Ex: contact@premium.com", t: "email" }, 
          { k: "phone", l: "Téléphone Mobile", p: "Ex: +212 6 00 00 00 00", t: "tel" }, 
          { k: "cin", l: "Numéro CIN / Passeport", p: "Ex: AB123456" }, 
          { k: "licenseNumber", l: "Numéro de Permis", p: "Ex: 12345678", span: "md:col-span-2" } 
        ].map((f) => (
          <div key={f.k} className={cn("space-y-2", f.span || "")}>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              {f.l}
              {scanSuccess && (f.k === "name" || f.k === "cin" || f.k === "licenseNumber") && 
                <span className="text-emerald-500 text-xs bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 font-medium">EXTRAIT PAR IA</span>
              }
            </label>
            <input 
              type={f.t || "text"} 
              placeholder={f.p} 
              value={(booking.client as any)[f.k]} 
              onChange={(e) => update("client", { ...booking.client, [f.k]: e.target.value })} 
              className={cn(
                "w-full bg-slate-50 border border-slate-100 rounded-xl px-6 py-4 font-medium text-slate-900 focus:bg-white focus:border-primary/20 outline-none transition-all duration-200 placeholder:text-slate-300", 
                scanSuccess && (f.k === "name" || f.k === "cin" || f.k === "licenseNumber") ? "bg-emerald-50/30 border-emerald-100" : ""
              )} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}
