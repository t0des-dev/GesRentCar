"use client";

import { useState, useRef } from "react";
import { Upload, ImageIcon, Loader2, CheckCircle2, X } from "lucide-react";
import api from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/utils/image";

interface AssetUploadProps {
  type: "logo" | "hero" | "favicon";
  label: string;
  currentUrl?: string;
  onUploadComplete: (url: string) => void;
}

export default function AssetUpload({ type, label, currentUrl, onUploadComplete }: AssetUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const res = await api.post("/config/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      onUploadComplete(res.data.url);
    } catch (err) {
      console.error("Upload error", err);
      alert("Erreur lors du téléchargement.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "relative group cursor-pointer border-2 border-dashed rounded-[32px] transition-all duration-500 overflow-hidden",
          dragActive ? "border-primary bg-primary/5" : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50",
          currentUrl ? "h-48" : "h-32"
        )}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
        />

        {currentUrl ? (
          <div className="absolute inset-0 w-full h-full">
            <img src={getImageUrl(currentUrl)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Asset" />
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
               <Upload className="text-white" size={24} />
               <span className="text-white text-[10px] font-black uppercase tracking-widest">Changer l'image</span>
            </div>
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[8px] font-black uppercase tracking-widest text-white">
              Actuel
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400 group-hover:text-primary transition-colors">
            {uploading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <Upload size={24} />
            )}
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest">Cliquez ou déposez</p>
              <p className="text-[8px] font-medium italic">PNG, JPG, SVG (Max 5MB)</p>
            </div>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="animate-spin text-primary" size={32} />
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">Téléchargement...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
