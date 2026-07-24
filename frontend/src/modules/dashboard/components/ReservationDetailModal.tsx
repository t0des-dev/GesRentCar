"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Car, Calendar, DollarSign, Shield, Star, Send, Loader2 } from "lucide-react";
import { fmt } from "@/shared/utils/format";
import { useSubmitReview } from "@/shared/hooks/useApi";
import { cn } from "@/shared/utils";

interface ReservationDetail {
  id: number | string;
  vehicle: string;
  vehicleId?: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  img?: string;
  hasContract?: boolean;
  status?: string;
  hasReview?: boolean;
}

interface ReservationDetailModalProps {
  reservation: ReservationDetail | null;
  onClose: () => void;
}

function ReviewForm({
  vehicleId,
  reservationId,
  vehicleName,
  onSuccess,
}: {
  vehicleId: number;
  reservationId: number;
  vehicleName: string;
  onSuccess: () => void;
}) {
  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [cleanliness, setCleanliness] = useState(5);
  const [performance, setPerformance] = useState(5);
  const [valueForMoney, setValueForMoney] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  const submitReview = useSubmitReview();

  const handleSubmit = () => {
    submitReview.mutate(
      {
        vehicle_id: vehicleId,
        reservation_id: reservationId,
        rating,
        title: title || undefined,
        comment: comment || undefined,
        cleanliness,
        performance,
        value_for_money: valueForMoney,
      },
      {
        onSuccess: () => {
          setSubmitted(true);
          setTimeout(() => onSuccess(), 1500);
        },
      }
    );
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-400/30 flex items-center justify-center mx-auto mb-4">
          <Star size={28} className="text-emerald-400" />
        </div>
        <h4 className="text-lg font-bold text-ink-1 mb-2">Merci pour votre avis !</h4>
        <p className="text-sm text-ink-3">Votre retour nous aide &agrave; am&eacute;liorer nos services.</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-bold text-ink-1 uppercase tracking-wider mb-1">
          Avis pour {vehicleName}
        </h4>
        <p className="text-xs text-ink-3">Partagez votre exp&eacute;rience de location</p>
      </div>

      {/* Main Rating */}
      <div className="text-center">
        <p className="text-xs font-bold text-ink-3 uppercase tracking-wider mb-3">Note globale</p>
        <div className="flex items-center justify-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              onClick={() => setRating(star)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                size={32}
                className={cn(
                  "transition-colors",
                  (hoveredStar || rating) >= star
                    ? "fill-gold text-gold"
                    : "text-ink-3/30"
                )}
              />
            </button>
          ))}
        </div>
        <p className="text-sm font-bold text-gold mt-2">{rating}/5</p>
      </div>

      {/* Sub Ratings */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Propret\u00e9", value: cleanliness, setter: setCleanliness },
          { label: "Performance", value: performance, setter: setPerformance },
          { label: "Rapport Qualit\u00e9/Prix", value: valueForMoney, setter: setValueForMoney },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <p className="text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-2">{item.label}</p>
            <div className="flex items-center justify-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => item.setter(star)}
                  className="p-0.5"
                >
                  <Star
                    size={16}
                    className={cn(
                      "transition-colors",
                      item.value >= star
                        ? "fill-gold text-gold"
                        : "text-ink-3/30"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Title */}
      <div>
        <label className="text-[10px] font-bold text-ink-3 uppercase tracking-wider">Titre (optionnel)</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="R\u00e9sumez votre exp\u00e9rience"
          className="w-full mt-2 px-4 py-3 rounded-xl bg-surface-1 border-2 border-border text-sm text-ink-1 placeholder:text-ink-3/50 focus:border-gold focus:outline-none transition-colors"
        />
      </div>

      {/* Comment */}
      <div>
        <label className="text-[10px] font-bold text-ink-3 uppercase tracking-wider">Commentaire (optionnel)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="D\u00e9crivez votre exp\u00e9rience en d\u00e9tail..."
          rows={3}
          className="w-full mt-2 px-4 py-3 rounded-xl bg-surface-1 border-2 border-border text-sm text-ink-1 placeholder:text-ink-3/50 focus:border-gold focus:outline-none transition-colors resize-none"
        />
      </div>

      {/* Submit */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={submitReview.isPending}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gold to-gold/90 text-ink-1 font-bold text-xs uppercase tracking-wider hover:shadow-lg hover:shadow-gold/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitReview.isPending ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Send size={16} />
        )}
        {submitReview.isPending ? "Envoi en cours..." : "Envoyer mon avis"}
      </motion.button>
    </div>
  );
}

export default function ReservationDetailModal({ reservation, onClose }: ReservationDetailModalProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  if (!reservation) return null;

  const modalVariants = {
    hidden: { scale: 0.9, opacity: 0, y: 20 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    exit: {
      scale: 0.9,
      opacity: 0,
      y: 20,
      transition: { duration: 0.3 }
    }
  } as const;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  } as const;

  const isCompleted = reservation.status === "completed";
  const canReview = isCompleted && !reservation.hasReview && typeof reservation.vehicleId === "number";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute inset-0 bg-surface-0/80 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-surface-0 rounded-2xl w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl border border-gold/40 dark:border-gold/30"
        >
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="absolute top-6 right-6 z-20 w-12 h-12 bg-surface-1 border-2 border-border hover:border-gold hover:bg-gold/5 text-ink-2 hover:text-gold rounded-lg flex items-center justify-center transition-all"
          >
            <X size={22} strokeWidth={2} />
          </motion.button>

          {/* Hero Image */}
          <div className="h-64 relative overflow-hidden">
            {reservation.img ? (
              <Image
                src={reservation.img}
                alt={reservation.vehicle}
                className="absolute inset-0 w-full h-full object-cover"
                width={800}
                height={400}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-surface-1">
                <Car size={72} className="text-gold/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-0 via-surface-0/40 to-transparent flex items-end p-8">
              <div>
                <div className="inline-block px-4 py-2 rounded-lg bg-gold/20 border border-gold/40 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-gold">R&eacute;f&eacute;rence #{reservation.id}00X</span>
                </div>
                <h2 className="text-3xl font-bold text-ink-1 tracking-tight font-serif">{reservation.vehicle}</h2>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Review Form or Details */}
            {showReviewForm && canReview ? (
              <ReviewForm
                vehicleId={reservation.vehicleId!}
                reservationId={Number(reservation.id)}
                vehicleName={reservation.vehicle}
                onSuccess={() => setShowReviewForm(false)}
              />
            ) : (
              <>
                {/* Details Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {/* Dates */}
                  <div className="bg-surface-1 p-6 rounded-xl border-2 border-border hover:border-gold/40 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar size={18} className="text-gold" />
                      <p className="text-xs font-bold uppercase tracking-widest text-ink-3">Itin&eacute;raire Temporel</p>
                    </div>
                    <p className="font-semibold text-lg text-ink-1">
                      {reservation.startDate}
                    </p>
                    <p className="text-ink-2 text-sm mt-1">&rarr;</p>
                    <p className="font-semibold text-lg text-ink-1">
                      {reservation.endDate}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="bg-gradient-to-br from-gold/10 to-gold/5 p-6 rounded-xl border-2 border-gold/40">
                    <div className="flex items-center gap-3 mb-3">
                      <DollarSign size={18} className="text-gold" />
                      <p className="text-xs font-bold uppercase tracking-widest text-ink-3">Investissement</p>
                    </div>
                    <p className="font-bold text-3xl text-gold">
                      {fmt(reservation.totalPrice)} <span className="text-lg text-ink-3">DH</span>
                    </p>
                    <div className="flex items-center gap-2 mt-3 text-emerald-600">
                      <Shield size={14} strokeWidth={2} />
                      <p className="text-xs font-bold uppercase tracking-wider">Transaction S&eacute;curis&eacute;e</p>
                    </div>
                  </div>
                </motion.div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col sm:flex-row gap-3 justify-end"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="px-8 py-3 rounded-lg bg-surface-1 border-2 border-border hover:border-gold text-ink-1 font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    Retour
                  </motion.button>

                  {canReview && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowReviewForm(true)}
                      className="px-8 py-3 rounded-lg bg-gradient-to-r from-gold to-gold/90 text-ink-1 font-bold text-xs uppercase tracking-wider hover:shadow-lg hover:shadow-gold/40 transition-all flex items-center justify-center gap-2"
                    >
                      <Star size={14} />
                      Laisser un avis
                    </motion.button>
                  )}

                  {reservation.hasContract && (
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={`${process.env.NEXT_PUBLIC_API_URL || "/api/v1"}/reservations/${reservation.id}/contract/file?lang=fr`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-3 rounded-lg bg-gradient-to-r from-gold to-gold/90 text-ink-1 font-bold text-xs uppercase tracking-wider hover:shadow-lg hover:shadow-gold/40 transition-all cursor-pointer flex items-center justify-center animate-pulse"
                    >
                      T&eacute;l&eacute;charger l&apos;Acte
                    </motion.a>
                  )}
                </motion.div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
