"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Star, MessageSquare, Quote, Upload, Image, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/shared/utils";
import api from "@/shared/services/client";
import { notifyError } from "@/components/Notifications";

const ITEMS_PER_PAGE = 10;

const AVATARS_PRESET = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=200&auto=format&fit=crop",
];

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  image?: string;
}

interface TestimonialsManagerProps {
  testimonials: Testimonial[];
  onChange: (testimonials: Testimonial[]) => void;
}

function AvatarPicker({ currentImage, onSelect, onRemove }: { currentImage?: string; onSelect: (url: string) => void; onRemove: () => void }) {
  const [showPicker, setShowPicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const togglePicker = () => {
    if (!showPicker && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 8, left: rect.left });
    }
    setShowPicker(!showPicker);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "hero");
    try {
      const res = await api.post("/config/upload", formData, {
        headers: { "Content-Type": undefined }
      });
      onSelect(res.data.url);
      setShowPicker(false);
    } catch {
      notifyError("Erreur lors de l'upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div
        ref={btnRef}
        onClick={togglePicker}
        className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 border-2 border-dashed border-slate-300 cursor-pointer hover:border-primary transition-all flex items-center justify-center shrink-0"
      >
        {currentImage ? (
          <img src={currentImage} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <Image size={18} className="text-slate-300" />
        )}
      </div>

      {showPicker && (
        <>
          <div className="fixed inset-0 z-[99]" onClick={() => setShowPicker(false)} />
          <div
            className="fixed z-[100] w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 space-y-3"
            style={{ top: pos.top, left: pos.left }}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-700">Choisir un avatar</p>
              <button onClick={() => setShowPicker(false)} className="text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {AVATARS_PRESET.map((url, i) => (
                <button
                  key={i}
                  onClick={() => { onSelect(url); setShowPicker(false); }}
                  className={cn(
                    "w-10 h-10 rounded-full overflow-hidden border-2 hover:scale-110 transition-all",
                    currentImage === url ? "border-primary" : "border-transparent"
                  )}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all"
              >
                {uploading ? (
                  <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                ) : (
                  <Upload size={14} />
                )}
                {uploading ? "Upload..." : "Uploader une image"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file);
                  e.target.value = "";
                }}
              />
            </div>

            {currentImage && (
              <button
                onClick={() => { onRemove(); setShowPicker(false); }}
                className="w-full px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
              >
                Supprimer l'image
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default function TestimonialsManager({ testimonials, onChange }: TestimonialsManagerProps) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(testimonials.length / ITEMS_PER_PAGE);
  const paged = testimonials.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  const add = () => {
    onChange([...testimonials, { name: "Nouveau Client", role: "Voyageur", content: "Superbe expérience...", rating: 5, image: "" }]);
    const newTotal = Math.ceil((testimonials.length + 1) / ITEMS_PER_PAGE);
    setPage(newTotal - 1);
  };

  const remove = (globalIndex: number) => {
    const next = [...testimonials];
    next.splice(globalIndex, 1);
    onChange(next);
    const newTotal = Math.ceil(next.length / ITEMS_PER_PAGE);
    if (page >= newTotal && newTotal > 0) setPage(newTotal - 1);
  };

  const update = (globalIndex: number, field: keyof Testimonial, value: any) => {
    const next = [...testimonials];
    next[globalIndex] = { ...next[globalIndex], [field]: value };
    onChange(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
            <Quote size={20} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">Témoignages Clients</h3>
            <p className="text-xs text-slate-400 mt-0.5">{testimonials.length} avis au total</p>
          </div>
        </div>
        <button
          onClick={add}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-primary transition-all"
        >
          <Plus size={14} /> Ajouter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {paged.map((t, localIdx) => {
            const globalIdx = page * ITEMS_PER_PAGE + localIdx;
            return (
              <motion.div
                key={globalIdx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-sm relative group"
              >
                <button
                  onClick={() => remove(globalIdx)}
                  className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>

                <div className="flex gap-4 mb-4">
                  <AvatarPicker
                    currentImage={t.image}
                    onSelect={(url) => update(globalIdx, "image", url)}
                    onRemove={() => update(globalIdx, "image", "")}
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-4">
                      <div className="flex-1 space-y-1.5">
                        <label className="text-[9px] font-black uppercase text-slate-400">Nom du client</label>
                        <input
                          type="text"
                          value={t.name ?? ""}
                          onChange={e => update(globalIdx, 'name', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 font-bold text-sm outline-none focus:border-primary transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase text-slate-400">Note</label>
                        <div className="flex items-center gap-1 h-9">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              size={14}
                              onClick={() => update(globalIdx, 'rating', star)}
                              className={cn("cursor-pointer", t.rating >= star ? "fill-amber-400 text-amber-400" : "text-slate-200")}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400">Rôle / Ville</label>
                    <input
                      type="text"
                      value={t.role ?? ""}
                      onChange={e => update(globalIdx, 'role', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 font-bold text-xs outline-none focus:border-primary transition-all"
                      placeholder="Casablanca · BMW 5 Series"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400">Témoignage</label>
                    <textarea
                      rows={3}
                      value={t.content ?? ""}
                      onChange={e => update(globalIdx, 'content', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-medium text-xs outline-none focus:border-primary transition-all resize-none italic"
                      placeholder="Décrivez votre expérience..."
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className={cn(
              "w-9 h-9 rounded-full border flex items-center justify-center transition-all",
              page === 0 ? "border-slate-100 text-slate-300 cursor-not-allowed" : "border-slate-200 text-slate-500 hover:bg-slate-50"
            )}
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={cn(
                  "w-8 h-8 rounded-full text-xs font-bold transition-all",
                  i === page ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className={cn(
              "w-9 h-9 rounded-full border flex items-center justify-center transition-all",
              page >= totalPages - 1 ? "border-slate-100 text-slate-300 cursor-not-allowed" : "border-slate-200 text-slate-500 hover:bg-slate-50"
            )}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {testimonials.length === 0 && (
        <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[40px]">
          <MessageSquare size={32} className="mx-auto text-slate-200 mb-4" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Aucun témoignage configuré</p>
        </div>
      )}
    </div>
  );
}
