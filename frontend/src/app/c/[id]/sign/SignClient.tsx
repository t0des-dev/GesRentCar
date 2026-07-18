"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import SignaturePad from "@/components/SignaturePad";
import { Car, FileText, CheckCircle, AlertCircle, FileDown } from "lucide-react";
import api from "@/shared/services/client";

export default function SignClient() {
  const params = useParams();
  const id = params?.id as string;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [contractUrl, setContractUrl] = useState("");

  const handleSaveSignature = async (base64: string) => {
    setLoading(true);
    setError("");

    try {
      const res = await api.post(`/public/reservations/${id}/sign`, {
        signature: base64,
      });

      if (res.data?.url) {
        setContractUrl(res.data.url);
      }
      setSuccess(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Une erreur est survenue lors de la signature.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-[32px] p-8 text-center shadow-xl border border-slate-100 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">Contrat Signé !</h1>
          <p className="text-slate-500 font-medium mb-8">
            Merci. Votre signature a été enregistrée avec succès. Vous pouvez maintenant télécharger votre copie du contrat.
          </p>
          {contractUrl && (
            <a
              href={contractUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <FileDown size={20} />
              Télécharger le PDF
            </a>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 md:p-8">
      <div className="bg-white max-w-lg w-full rounded-[32px] shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-slate-900 text-white p-8 text-center relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
            <Car size={28} className="text-primary" />
          </div>
          <h1 className="text-2xl font-black relative z-10">Vectoria Rent Car</h1>
          <p className="text-sm font-medium text-slate-400 relative z-10 mt-1">Signature Numérique</p>
        </div>

        <div className="p-8">
          <div className="flex items-center gap-3 text-slate-600 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <FileText size={24} className="text-primary" />
            <div>
              <p className="text-sm font-bold text-slate-900">Contrat N° VRC-{id.padStart(5, '0')}</p>
              <p className="text-xs font-medium text-slate-500">Veuillez signer dans le cadre ci-dessous.</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm font-medium">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <SignaturePad onSave={handleSaveSignature} isLoading={loading} />
          
          <p className="text-center text-xs text-slate-400 mt-6 font-medium px-4">
            En signant, vous acceptez les conditions générales de location de Vectoria Rent Car.
          </p>
        </div>
      </div>
    </main>
  );
}
