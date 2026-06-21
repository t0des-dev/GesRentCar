"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Check, Download, Loader2, AlertCircle, FileText, Calendar, Wallet, Car, ArrowLeft, ShieldCheck } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { reservationService } from "@/lib/api/reservations";
import { useSignContract } from "@/shared/hooks/useApi";
import { useQuery } from "@tanstack/react-query";
import SignaturePad from "@/components/SignaturePad";
import Link from "next/link";
import { cn } from "@/shared/utils";
import { fmt } from "@/shared/utils/format";

export default function ContractSignClient() {
  const { id } = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  
  const [success, setSuccess] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  const { data: reservation, isLoading } = useQuery({
    queryKey: ["reservation", id],
    queryFn: () => reservationService.getReservation(Number(id)),
    enabled: !!id,
  });

  const { mutate: signContract, isPending } = useSignContract();

  const handleSign = (signatureData: string) => {
    signContract(
      { id: Number(id), signature: signatureData },
      {
        onSuccess: (res) => {
          setSuccess(true);
          setSignedUrl(res.url);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <div className="w-12 h-12 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-muted-foreground font-semibold uppercase tracking-widest text-xs">Préparation du contrat...</p>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Contrat Introuvable</h2>
        <p className="text-muted-foreground max-w-md">La réservation #{id} n'existe pas ou vous n'avez pas l'autorisation d'y accéder.</p>
        <Link href="/dashboard" className="mt-6 text-primary font-semibold hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Retour au tableau de bord
        </Link>
      </div>
    );
  }

  const contract = (reservation as any).contract;
  const isAlreadySigned = (contract && contract.signed_at) || success;
  const currentPdfUrl = signedUrl || (contract ? `${process.env.NEXT_PUBLIC_API_URL || "/api/v1"}/public/reservations/${id}/contract?lang=fr` : null);

  return (
    <main className="min-h-screen pt-24 pb-20 bg-[#f8fafc]">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-all text-xs font-semibold uppercase tracking-widest mb-3">
              <ArrowLeft size={14} />
              Dashboard
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Signature <span className="text-primary">Digitale</span>
            </h1>
            <p className="text-slate-400 font-medium text-sm mt-1">
              Contrat de location de véhicule <span className="text-slate-300 mx-1">—</span> <span className="text-primary font-semibold">Référence VC-{reservation.id.toString().padStart(4, "0")}</span>
            </p>
          </div>
          
          <div className={cn(
            "px-5 py-2 rounded-xl text-xs font-semibold uppercase tracking-widest border",
            isAlreadySigned 
              ? "badge-success" 
              : "badge-warning"
          )}>
            {isAlreadySigned ? "Document Signé" : "Signature Requise"}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100/80 p-6 shadow-sm">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <FileText size={14} className="text-primary" /> Détails du Contrat
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                    <Car size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">Véhicule</p>
                    <p className="font-semibold text-slate-900">{reservation.vehicle?.brand} {reservation.vehicle?.model}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                    <Calendar size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">Période</p>
                    <p className="font-semibold text-slate-900">Du {new Date(reservation.start_date).toLocaleDateString()}</p>
                    <p className="font-semibold text-primary text-sm">Au {new Date(reservation.end_date).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mb-1">Montant Net</p>
                  <p className="text-2xl font-bold text-slate-900 tracking-tight">
                    {fmt(reservation.total_price)} <span className="text-sm text-slate-400">DH</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck className="text-primary" size={20} />
                <h4 className="font-semibold uppercase tracking-widest text-sm">Sécurité Légale</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Conformément à la loi 53-05, cette signature électronique certifie votre consentement et garantit l'intégrité de ce contrat.
              </p>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl border border-slate-100/80 p-8 shadow-sm h-full flex flex-col">
              {isAlreadySigned ? (
                <div className="flex flex-col items-center justify-center py-12 text-center h-full space-y-8">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white shadow-lg">
                     <Check size={40} strokeWidth={3} />
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Document Validé</h2>
                    <p className="text-slate-400 font-medium max-w-xs mx-auto mt-1">
                      Votre contrat a été signé électroniquement et archivé avec succès.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md pt-2">
                    {currentPdfUrl && (
                      <a
                        href={currentPdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 btn-primary text-xs"
                      >
                        <Download size={16} />
                        Exporter PDF
                      </a>
                    )}
                    <Link
                      href="/dashboard"
                      className="flex-1 flex items-center justify-center gap-2 btn-secondary text-xs"
                    >
                      Dashboard
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 flex flex-col h-full">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">Signer votre contrat</h3>
                    <p className="text-slate-400 font-medium text-sm">
                      Veuillez dessiner votre signature dans l'espace sécurisé ci-dessous. 
                    </p>
                  </div>

                  <div className="flex-1 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-4">
                    <SignaturePad onSave={handleSign} isLoading={isPending} />
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                     <p className="text-[10px] text-slate-300 font-semibold uppercase tracking-widest">
                       ID TRANSACTION : {Math.random().toString(36).substr(2, 9).toUpperCase()}
                     </p>
                     <p className="text-[10px] text-slate-300 font-semibold uppercase tracking-widest">
                       Certifié par VectoriaSecure
                     </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
