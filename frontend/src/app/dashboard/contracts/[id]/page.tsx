"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Check, Download, Loader2, AlertCircle, FileText, Calendar, Wallet, Car, ArrowLeft, ShieldCheck } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { reservationService } from "@/lib/api/reservations";
import { useSignContract } from "@/hooks/useApi";
import { useQuery } from "@tanstack/react-query";
import SignaturePad from "@/components/SignaturePad";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ContractSignPage() {
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
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Préparation du contrat...</p>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-3xl font-black mb-2">Contrat Introuvable</h2>
        <p className="text-muted-foreground max-w-md">La réservation #{id} n'existe pas ou vous n'avez pas l'autorisation d'y accéder.</p>
        <Link href="/dashboard" className="mt-8 text-primary font-bold hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Retour au tableau de bord
        </Link>
      </div>
    );
  }

  const contract = (reservation as any).contract;
  const isAlreadySigned = (contract && contract.signed_at) || success;
  const currentPdfUrl = signedUrl || (contract?.file_path ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${contract.file_path}` : null);

  return (
    <main className="min-h-screen pt-24 pb-24 bg-[#f8fafc]">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-4">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-all text-xs font-black uppercase tracking-widest group">
              <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                <ArrowLeft size={14} /> 
              </div>
              Dashboard
            </Link>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 leading-none">
              Signature <span className="text-primary/10">Digitale</span>
            </h1>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
              Contrat de location de véhicule <span className="text-slate-300 mx-2">—</span> <span className="text-primary">Référence VC-{reservation.id.toString().padStart(4, "0")}</span>
            </p>
          </div>
          
          <div className={cn(
            "px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm border",
            isAlreadySigned 
              ? "bg-green-50 border-green-100 text-green-600" 
              : "bg-orange-50 border-orange-100 text-orange-600 animate-pulse"
          )}>
            {isAlreadySigned ? "✓ Document Signé" : "● Signature Requise"}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Details Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white border border-slate-200/60 rounded-[32px] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                <FileText size={16} className="text-primary" /> Détails du Contrat
              </h3>
              
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 shadow-sm">
                    <Car size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Véhicule</p>
                    <p className="font-black text-slate-900 text-lg leading-none">{reservation.vehicle?.brand} {reservation.vehicle?.model}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 shadow-sm">
                    <Calendar size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Période</p>
                    <p className="font-black text-slate-900 leading-none">Du {new Date(reservation.start_date).toLocaleDateString()}</p>
                    <p className="font-black text-primary text-sm mt-1">Au {new Date(reservation.end_date).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Montant Net</p>
                  <p className="text-4xl font-black text-slate-900 tracking-tighter">
                    {reservation.total_price.toLocaleString()} <span className="text-xl text-slate-400">DH</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl shadow-slate-900/20 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <ShieldCheck size={120} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="text-primary" size={24} />
                  <h4 className="font-black uppercase tracking-widest text-sm">Sécurité Légale</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-bold">
                  Conformément à la loi 53-05, cette signature électronique certifie votre consentement et garantit l'intégrité de ce contrat.
                </p>
              </div>
            </div>
          </div>

          {/* Signature/Success Column */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-slate-200/60 rounded-[44px] p-12 shadow-[0_20px_60px_rgba(0,0,0,0.04)] relative overflow-hidden h-full flex flex-col">
              {isAlreadySigned ? (
                <div className="flex flex-col items-center justify-center py-16 text-center h-full space-y-10 animate-fade-in">
                  <div className="w-28 h-28 bg-primary rounded-full flex items-center justify-center text-white shadow-2xl shadow-primary/30 relative">
                     <Check size={56} strokeWidth={4} />
                     <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
                  </div>
                  
                  <div className="space-y-4">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Document Validé</h2>
                    <p className="text-slate-400 font-bold max-w-xs mx-auto">
                      Votre contrat a été signé électroniquement et archivé avec succès.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md pt-4">
                    {currentPdfUrl && (
                      <a
                        href={currentPdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-[20px] font-black hover:scale-105 transition-all shadow-xl"
                      >
                        <Download size={20} />
                        Exporter PDF
                      </a>
                    )}
                    <Link
                      href="/dashboard"
                      className="flex-1 flex items-center justify-center gap-3 bg-slate-100 text-slate-600 px-10 py-5 rounded-[20px] font-black hover:bg-slate-200 transition-all"
                    >
                      Dashboard
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-10 flex flex-col h-full">
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Signer votre contrat</h3>
                    <p className="text-slate-400 font-bold">
                      Veuillez dessiner votre signature dans l'espace sécurisé ci-dessous. 
                    </p>
                  </div>

                  <div className="flex-1 bg-slate-50 rounded-[28px] border-2 border-dashed border-slate-200 p-4">
                    <SignaturePad onSave={handleSign} isLoading={isPending} />
                  </div>

                  <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                     <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest">
                       ID TRANSACTION : {Math.random().toString(36).substr(2, 9).toUpperCase()}
                     </p>
                     <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest">
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
