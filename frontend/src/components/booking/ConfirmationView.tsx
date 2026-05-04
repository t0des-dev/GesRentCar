"use client";

import { Check, FileText } from "lucide-react";
import { BookingState } from "@/types/booking";

interface ConfirmationViewProps {
  booking: BookingState;
  reservationId: number | null;
  deposit: number;
  total: number;
  vehicle: any;
}

export default function ConfirmationView({ booking, reservationId, deposit, total, vehicle }: ConfirmationViewProps) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const contractUrl = reservationId
    ? `${apiBase}/public/reservations/${reservationId}/contract`
    : null;

  const startFormatted = booking.startDate
    ? new Date(booking.startDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
    : '';

  return (
    <main className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-[#f8fafc]">
      <div className="text-center flex flex-col items-center gap-6 max-w-lg mx-auto px-4 animate-in zoom-in duration-500">
        {/* Success icon */}
        <div className="w-32 h-32 rounded-full bg-green-500/10 flex items-center justify-center border-4 border-green-500 shadow-2xl shadow-green-500/20">
          <Check size={50} className="text-green-500" strokeWidth={3} />
        </div>

        <h1 className="text-4xl font-black tracking-tight text-slate-900 mt-4">Véhicule Bloqué !</h1>
        <p className="text-slate-500 font-semibold text-lg leading-relaxed">
          Félicitations <strong>{booking.client.name}</strong> !<br/>
          Votre acompte de <strong>{deposit.toLocaleString()} DH</strong> a été traité avec succès.
          {startFormatted && <> Le véhicule vous attendra le <strong>{startFormatted}</strong>.</>}
        </p>

        {/* Info card */}
        <div className="w-full bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 text-left space-y-3 mt-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400 font-bold">Véhicule</span>
            <span className="font-black text-slate-900">{vehicle?.brand} {vehicle?.model}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400 font-bold">Départ</span>
            <span className="font-black text-slate-900">{booking.startDate}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400 font-bold">Retour</span>
            <span className="font-black text-slate-900">{booking.endDate}</span>
          </div>
          <div className="h-px bg-slate-100" />
          <div className="flex justify-between">
            <span className="text-slate-400 font-bold text-sm">Montant total</span>
            <span className="font-black text-slate-900">{total.toLocaleString()} DH</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-600 font-bold text-sm">Acompte payé</span>
            <span className="font-black text-green-600">{deposit.toLocaleString()} DH ✓</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col w-full gap-3 mt-2">
          {contractUrl && (
            <a
              href={contractUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black hover:scale-105 transition-transform shadow-xl shadow-slate-900/20"
            >
              <FileText size={20} />
              Télécharger mon Contrat PDF
            </a>
          )}
          <a
            href="/"
            className="w-full flex items-center justify-center gap-3 bg-white text-slate-600 border-2 border-slate-200 px-10 py-4 rounded-2xl font-black hover:bg-slate-50 transition-colors"
          >
            Retourner à l'accueil
          </a>
        </div>
      </div>
    </main>
  );
}
