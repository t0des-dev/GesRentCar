"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Send, Loader2 } from "lucide-react";
import { cn } from "@/shared/utils";

interface ReviewFormProps {
  vehicleId: number;
  onSuccess?: () => void;
}

interface SubRating {
  key: string;
  label: string;
  value: number;
}

export default function ReviewForm({ vehicleId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [subRatings, setSubRatings] = useState<SubRating[]>([
    { key: "cleanliness", label: "Propreté", value: 0 },
    { key: "performance", label: "Performance", value: 0 },
    { key: "value_for_money", label: "Rapport qualité/prix", value: 0 },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubRating = (key: string, value: number) => {
    setSubRatings((prev) =>
      prev.map((sr) => (sr.key === key ? { ...sr, value } : sr))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) return;

    setSubmitting(true);
    try {
      const subRatingsObj: Record<string, number> = {};
      subRatings.forEach((sr) => {
        if (sr.value > 0) subRatingsObj[sr.key] = sr.value;
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "/api/v1"}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("vectoria_token")}`,
        },
        body: JSON.stringify({
          vehicle_id: vehicleId,
          rating,
          title: title.trim() || undefined,
          comment: comment.trim(),
          ...subRatingsObj,
        }),
      });

      if (res.ok) {
        setRating(0);
        setTitle("");
        setComment("");
        setSubRatings((prev) => prev.map((sr) => ({ ...sr, value: 0 })));
        onSuccess?.();
      }
    } catch (err) {
      console.error("Review submission failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border-2 border-border bg-surface-1 p-6">
      <h3 className="text-sm font-bold text-ink-1 uppercase tracking-wider mb-6">Laisser un avis</h3>

      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-ink-3 mb-3">Note globale *</p>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => {
            const starValue = i + 1;
            return (
              <motion.button
                key={i}
                type="button"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onMouseEnter={() => setHoveredStar(starValue)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => setRating(starValue)}
                className="p-0.5 transition-colors"
                aria-label={`${starValue} étoile${starValue > 1 ? "s" : ""}`}
              >
                <Star
                  size={32}
                  className={cn(
                    "transition-colors cursor-pointer",
                    (hoveredStar || rating) >= starValue
                      ? "text-gold fill-gold"
                      : "text-ink-3/30 hover:text-ink-3/50"
                  )}
                />
              </motion.button>
            );
          })}
          {rating > 0 && (
            <span className="ml-2 text-sm font-bold text-gold">{rating}/5</span>
          )}
        </div>
      </div>

      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-ink-3 mb-3">Titre (optionnel)</p>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Résumez votre expérience..."
          className="w-full h-11 px-4 rounded-xl bg-surface-0 border-2 border-border text-sm text-ink-1 placeholder:text-ink-3/50 focus:border-gold focus:outline-none transition-colors"
        />
      </div>

      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-ink-3 mb-3">Commentaire *</p>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Partagez les détails de votre expérience..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-surface-0 border-2 border-border text-sm text-ink-1 placeholder:text-ink-3/50 focus:border-gold focus:outline-none transition-colors resize-none"
        />
      </div>

      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-ink-3 mb-4">Sous-notes (optionnel)</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {subRatings.map((sr) => (
            <div key={sr.key} className="rounded-xl bg-surface-0 border-2 border-border p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3 mb-2">{sr.label}</p>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, i) => {
                  const starValue = i + 1;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSubRating(sr.key, starValue)}
                      className="p-0"
                      aria-label={`${sr.label}: ${starValue}`}
                    >
                      <Star
                        size={18}
                        className={cn(
                          "transition-colors cursor-pointer",
                          sr.value >= starValue
                            ? "text-gold fill-gold"
                            : "text-ink-3/30 hover:text-ink-3/50"
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        disabled={submitting || rating === 0 || !comment.trim()}
        className={cn(
          "w-full h-12 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all",
          rating > 0 && comment.trim() && !submitting
            ? "bg-gradient-to-r from-gold to-gold/90 text-ink-1 shadow-lg shadow-gold/30 hover:shadow-xl hover:shadow-gold/40"
            : "bg-surface-2 text-ink-3 cursor-not-allowed"
        )}
      >
        {submitting ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <>
            <Send size={14} strokeWidth={2.5} />
            Envoyer l&apos;avis
          </>
        )}
      </motion.button>
    </form>
  );
}
