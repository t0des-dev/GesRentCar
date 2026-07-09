"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, User, ChevronDown, MessageSquare } from "lucide-react";
import { cn } from "@/shared/utils";
import ReviewForm from "./ReviewForm";

interface Review {
  id: number;
  user_name: string;
  rating: number;
  title?: string;
  comment: string;
  created_at: string;
  cleanliness?: number;
  performance?: number;
  value_for_money?: number;
}

interface ReviewSectionProps {
  vehicleId: number;
  reviews?: Review[];
  averageRating?: number;
  totalReviews?: number;
  hasReservation?: boolean;
}

function StarDisplay({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={cn(
            "transition-colors",
            i < Math.round(rating)
              ? "text-gold fill-gold"
              : "text-ink-3/30"
          )}
        />
      ))}
    </div>
  );
}

function RatingBar({ stars, count, total }: { stars: number; count: number; total: number }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold text-ink-3 w-8 text-right">{stars}★</span>
      <div className="flex-1 h-2 rounded-full bg-ink-1/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full bg-gold"
        />
      </div>
      <span className="text-xs text-ink-3 w-8">{count}</span>
    </div>
  );
}

export default function ReviewSection({
  vehicleId,
  reviews = [],
  averageRating = 0,
  totalReviews = 0,
  hasReservation = false,
}: ReviewSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => Math.round(r.rating) === stars).length,
  }));

  const displayedReviews = showAll ? reviews : reviews.slice(0, 4);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border-2 border-border bg-surface-1 p-6"
      >
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="text-center sm:text-left shrink-0">
            <p className="text-5xl font-bold text-ink-1">{averageRating.toFixed(1)}</p>
            <StarDisplay rating={averageRating} size={20} />
            <p className="text-xs text-ink-3 mt-2">{totalReviews} avis</p>
          </div>

          <div className="flex-1 space-y-2">
            {ratingDistribution.map(({ stars, count }) => (
              <RatingBar key={stars} stars={stars} count={count} total={totalReviews} />
            ))}
          </div>
        </div>
      </motion.div>

      {hasReservation && (
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-gold to-gold/90 text-ink-1 text-xs font-bold uppercase tracking-wider shadow-lg shadow-gold/30 hover:shadow-xl hover:shadow-gold/40 transition-all"
          >
            <MessageSquare size={15} strokeWidth={2.5} />
            Laisser un avis
          </motion.button>
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <ReviewForm
              vehicleId={vehicleId}
              onSuccess={() => setShowForm(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {displayedReviews.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ delay: idx * 0.06 }}
              className="rounded-2xl border-2 border-border bg-surface-1 p-6 hover:border-gold/30 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 flex items-center justify-center">
                    <User size={18} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-ink-1">{review.user_name}</p>
                    <p className="text-[10px] text-ink-3">{review.created_at}</p>
                  </div>
                </div>
                <StarDisplay rating={review.rating} />
              </div>

              {review.title && (
                <h4 className="text-sm font-bold text-ink-1 mb-2">{review.title}</h4>
              )}
              <p className="text-sm text-ink-2 leading-relaxed">{review.comment}</p>

              {(review.cleanliness || review.performance || review.value_for_money) && (
                <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border">
                  {review.cleanliness && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-ink-3">
                      Propreté: <span className="text-gold">{review.cleanliness}/5</span>
                    </span>
                  )}
                  {review.performance && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-ink-3">
                      Performance: <span className="text-gold">{review.performance}/5</span>
                    </span>
                  )}
                  {review.value_for_money && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-ink-3">
                      Rapport qualité/prix: <span className="text-gold">{review.value_for_money}/5</span>
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {reviews.length > 4 && (
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-border bg-surface-1 text-ink-2 text-xs font-bold uppercase tracking-wider hover:border-gold hover:text-gold transition-all"
          >
            {showAll ? "Voir moins" : `Voir les ${reviews.length} avis`}
            <ChevronDown size={14} className={cn("transition-transform", showAll && "rotate-180")} />
          </motion.button>
        </div>
      )}
    </div>
  );
}
