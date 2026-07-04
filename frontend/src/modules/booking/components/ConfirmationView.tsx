"use client";

import { useEffect } from "react";
import { Check, FileText } from "lucide-react";
import { BookingState } from "@/types/booking";
import confetti from "canvas-confetti";
import { fmt } from "@/shared/utils/format";

interface ConfirmationVehicle {
  brand?: string;
  model?: string;
}

interface ConfirmationViewProps {
  booking: BookingState;
  reservationId: number | null;
  deposit: number;
  total: number;
  vehicle?: ConfirmationVehicle | null;
}

export default function ConfirmationView({ booking, reservationId, deposit, total, vehicle }: ConfirmationViewProps) {
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
  const contractUrl = reservationId
    ? `${apiBase}/public/reservations/${reservationId}/contract`
    : null;

  const startFormatted = booking.startDate
    ? new Date(booking.startDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
    : '';

  return (
    <main className="min-h-screen py-24 flex items-center justify-center bg-surface-1">
      <div className="text-center flex flex-col items-center gap-8 max-w-lg mx-auto px-6">
        {/* Success icon */}
        <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center border-2 border-emerald-200">
          <Check size={40} className="text-emerald-600" strokeWidth={3} />
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-ink-1">Véhicule Bloqué !</h1>
        <p className="text-ink-2 text-base leading-relaxed">
          Félicitations <strong className="text-ink-1">{booking.client.name}</strong> !<br/>
          Votre acompte de <strong>{fmt(deposit)} DH</strong> a été traité avec succès.
          {startFormatted && <> Le véhicule vous attendra le <strong>{startFormatted}</strong>.</>}
        </p>

        {/* Info card */}
        <div className="w-full card-editorial p-8 text-left space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-ink-3 font-semibold">Véhicule</span>
            <span className="font-semibold text-ink-1">{vehicle?.brand} {vehicle?.model}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-ink-3 font-semibold">Départ</span>
            <span className="font-semibold text-ink-1">{booking.startDate}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-ink-3 font-semibold">Retour</span>
            <span className="font-semibold text-ink-1">{booking.endDate}</span>
          </div>
          <div className="h-px bg-surface-2" />
          <div className="flex justify-between">
            <span className="text-ink-3 font-semibold text-sm">Montant total</span>
            <span className="font-semibold text-ink-1">{fmt(total)} DH</span>
          </div>
          <div className="flex justify-between">
            <span className="text-emerald-600 font-semibold text-sm">Acompte payé</span>
            <span className="font-semibold text-emerald-600">{fmt(deposit)} DH ✓</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col w-full gap-3">
          {contractUrl && (
            <a
              href={contractUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full"
            >
              <FileText size={18} />
              Télécharger mon Contrat PDF
            </a>
          )}
          <a
            href="/"
            className="btn-secondary w-full"
          >
            Retourner à l&apos;accueil
          </a>
        </div>
      </div>
    </main>
  );
}
