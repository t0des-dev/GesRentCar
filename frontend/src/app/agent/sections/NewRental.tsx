"use client";

import { useState, useRef, useMemo } from "react";
import {
  ScanLine, User, Car, FileCheck, ChevronLeft, ChevronRight,
  Loader2, CheckCircle2, AlertCircle, Camera, Calendar, CreditCard, Phone, Mail, Hash,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const API = "http://localhost:8000/api";
const getToken = () => typeof window !== "undefined" ? localStorage.getItem("vectoria_token") || "" : "";

type ClientData = { name: string; cin: string; license?: string; email?: string; phone?: string; };
type Vehicle = { id: number; brand: string; model: string; plate: string; price_per_day: number; dynamic_price: number; type: string; };

const STEPS = [
  { id: 1, label: "Scan", icon: ScanLine },
  { id: 2, label: "Client", icon: User },
  { id: 3, label: "Véhicule", icon: Car },
  { id: 4, label: "Contrat", icon: FileCheck },
];

const daysBetween = (a: string, b: string) => {
  if (!a || !b) return 0;
  return Math.max(Math.ceil((new Date(b).getTime() - new Date(a).getTime()) / 86400000), 0);
};

export default function NewRental() {
  const [step, setStep] = useState(1);
  const [scanning, setScanning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [clientData, setClientData] = useState<ClientData>({ name: "", cin: "", license: "", email: "", phone: "" });
  const [savedClientId, setSavedClientId] = useState<number | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reservation, setReservation] = useState<any>(null);

  const { lang } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setStep(1); setError(""); setSuccess(""); setScanning(false); setSaving(false);
    setClientData({ name: "", cin: "", license: "", email: "", phone: "" });
    setSavedClientId(null); setVehicles([]); setSelectedVehicle(null);
    setStartDate(""); setEndDate(""); setReservation(null);
  };

  const handleScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true); setError("");
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("type", "cin");

      const res = await fetch(`${API}/ocr/scan`, {
        method: "POST",
        headers: { Accept: "application/json", Authorization: `Bearer ${getToken()}` },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setClientData({
          name: data.data.name || "",
          cin: data.data.id_number || "",
          license: "",
          email: "",
          phone: ""
        });
        setStep(2);
      } else {
        throw new Error(data.message || "Erreur d'analyse OCR.");
      }
    } catch (err: any) {
      setError(err.message || "Impossible de contacter le service OCR.");
    }
    finally { setScanning(false); }
  };

  const handleSaveClient = async () => {
    setSaving(true); setError("");
    try {
      const res = await fetch(`${API}/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(clientData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur de création du client.");
      setSavedClientId(data.id);
      
      const vRes = await fetch(`${API}/vehicles`, {
        headers: { Accept: "application/json", Authorization: `Bearer ${getToken()}` }
      });
      const vData = await vRes.json();
      setVehicles(Array.isArray(vData) ? vData : []);
      setStep(3);
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  const handleReserve = async () => {
    if (!selectedVehicle || !startDate || !endDate || !savedClientId) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setSaving(true); setError("");
    try {
      const res = await fetch(`${API}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({
          client_id: savedClientId,
          vehicle_id: selectedVehicle.id,
          start_date: startDate,
          end_date: endDate,
          payment_method: 'cash' // Default for agent portal
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur de réservation.");
      setReservation(data);
      setStep(4);
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  const handleContract = async () => {
    if (!reservation) return;
    setSaving(true); setError("");
    try {
      await fetch(`${API}/reservations/${reservation.id}/contract?lang=${lang}`, {
        method: "POST",
        headers: { Accept: "application/json", Authorization: `Bearer ${getToken()}` }
      });
      setSuccess("✅ Contrat généré et envoyé !");
    } catch {
      setError("Erreur lors de la génération du contrat.");
    }
    finally { setSaving(false); }
  };

  const totalPrice = selectedVehicle && startDate && endDate
    ? (selectedVehicle.dynamic_price || selectedVehicle.price_per_day) * daysBetween(startDate, endDate) : 0;

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="flex justify-between items-end border-b border-slate-100 pb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Nouvelle Location</h2>
          <p className="text-slate-400 font-medium text-sm italic">Parcours de réservation assisté par IA.</p>
        </div>
        <div className="flex items-center gap-1.5 bg-primary/5 text-primary px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/10">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Agent Connecté
        </div>
      </div>

      {/* Modern Stepper */}
      <div className="flex items-center justify-between max-w-2xl mx-auto mb-16 relative">
        <div className="absolute top-1/2 left-0 w-full h-px bg-slate-100 -z-10" />
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = step === s.id;
          const isDone = step > s.id;

          return (
            <div key={s.id} className="flex flex-col items-center gap-4 relative z-10">
              <div
                className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-2",
                  isActive ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/20 scale-110" :
                    isDone ? "bg-primary border-primary text-white" :
                      "bg-white border-slate-100 text-slate-300"
                )}
              >
                {isDone ? <CheckCircle2 size={24} /> : <Icon size={24} />}
              </div>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-[0.2em]",
                isActive ? "text-slate-900" : "text-slate-300"
              )}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-6 bg-red-50 border border-red-100 rounded-[24px] text-red-600 flex items-center gap-4 text-sm font-bold shadow-sm"
          >
            <AlertCircle size={20} />
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-6 bg-emerald-50 border border-emerald-100 rounded-[24px] text-emerald-600 flex items-center gap-4 text-sm font-bold shadow-sm"
          >
            <CheckCircle2 size={20} />
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          {/* Step 1: Scan */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 bg-slate-50 text-slate-400 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
                    Étape 01
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 leading-tight">Numérisation des <br />Documents</h3>
                  <p className="text-slate-500 font-medium leading-relaxed max-w-sm">
                    Utilisez l'appareil photo pour scanner la CIN ou le permis de conduire du client. Notre IA extraira automatiquement les informations.
                  </p>
                  
                  <div className="pt-4 flex flex-col gap-4">
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">1</div>
                      Placez le document à plat
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">2</div>
                      Évitez les reflets de lumière
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    ref={fileInputRef}
                    onChange={handleScan}
                    className="hidden"
                  />
                  <div
                    onClick={() => !scanning && fileInputRef.current?.click()}
                    className={cn(
                      "aspect-video rounded-[48px] border-4 border-dashed transition-all duration-700 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden",
                      scanning ? "border-primary bg-primary/5 shadow-2xl shadow-primary/20" : "border-slate-100 bg-slate-50 hover:border-primary/30 hover:bg-white"
                    )}
                  >
                    {scanning ? (
                      <div className="flex flex-col items-center gap-4">
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                          <motion.div 
                            animate={{ top: ["0%", "100%", "0%"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent blur-[2px] z-20"
                          />
                        </div>
                        <Loader2 size={48} className="text-primary animate-spin" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Analyse OCR en cours...</p>
                      </div>
                    ) : (
                      <>
                        <Camera size={64} className="text-slate-300 mb-4 group-hover:scale-110 group-hover:text-primary transition-all" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Cliquez pour capturer</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-8 border-t border-slate-50">
                <button
                  onClick={() => setStep(2)}
                  className="px-10 py-5 rounded-[24px] text-slate-400 font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
                >
                  Passer manuellement
                  <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Client */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="bg-slate-50/50 p-10 rounded-[48px] border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {[
                    { key: "name", label: "Nom Complet", Icon: User, type: "text", ph: "Jean Dupont" },
                    { key: "cin", label: "N° CIN", Icon: CreditCard, type: "text", ph: "AB123456" },
                    { key: "email", label: "Adresse Email", Icon: Mail, type: "email", ph: "client@email.com" },
                    { key: "phone", label: "Téléphone", Icon: Phone, type: "tel", ph: "0600000000" },
                  ].map(({ key, label, Icon, type, ph }) => (
                    <div key={key} className="space-y-3 group">
                      <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                        <Icon size={12} className="text-primary" />
                        {label}
                      </label>
                      <input
                        type={type}
                        value={(clientData as any)[key]}
                        onChange={(e) => setClientData({ ...clientData, [key]: e.target.value })}
                        placeholder={ph}
                        className="w-full bg-white border border-slate-100 px-6 py-4 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-8 border-t border-slate-50">
                <button
                  onClick={() => setStep(1)}
                  className="px-10 py-5 rounded-[24px] text-slate-400 font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
                >
                  <ChevronLeft size={18} />
                  Précédent
                </button>
                <button
                  onClick={handleSaveClient}
                  disabled={saving || !clientData.name || !clientData.cin}
                  className="px-12 py-5 rounded-[24px] bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest hover:bg-primary shadow-2xl hover:shadow-primary/30 disabled:opacity-30 transition-all flex items-center gap-3"
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                  {saving ? "Enregistrement..." : "Confirmer le Client"}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Vehicle Selection */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              {/* Date Selection Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-900 p-10 rounded-[48px] text-white">
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                    <Calendar size={12} className="text-primary" />
                    Début du Contrat
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-white/10 border border-white/10 px-6 py-4 rounded-2xl text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all [color-scheme:dark]"
                  />
                </div>
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                    <Calendar size={12} className="text-primary" />
                    Fin du Contrat
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-white/10 border border-white/10 px-6 py-4 rounded-2xl text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Vehicle List */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase">Sélection du Véhicule</h4>
                  <span className="text-[10px] font-black text-slate-400">{vehicles.length} véhicules disponibles</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {vehicles.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVehicle(v)}
                      className={cn(
                        "p-6 rounded-[32px] border-2 transition-all duration-500 cursor-pointer flex justify-between items-center group",
                        selectedVehicle?.id === v.id
                          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                          : "border-slate-50 bg-slate-50/50 hover:border-slate-200 hover:bg-white"
                      )}
                    >
                      <div className="flex items-center gap-5">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                          selectedVehicle?.id === v.id ? "bg-primary text-white" : "bg-white text-slate-400 shadow-sm"
                        )}>
                          <Car size={24} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm">{v.brand} {v.model}</p>
                          <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{v.plate}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-slate-900 text-base">
                          {(v.dynamic_price || v.price_per_day)?.toLocaleString("fr-FR")} DH
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">par jour</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Summary */}
              {selectedVehicle && startDate && endDate && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-primary/5 p-8 rounded-[32px] border border-primary/10 flex justify-between items-center"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Hash size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Résumé financier</p>
                      <p className="text-sm font-bold text-slate-600">Total pour {daysBetween(startDate, endDate)} jours</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-black text-slate-900">{totalPrice.toLocaleString("fr-FR")} DH</p>
                  </div>
                </motion.div>
              )}

              <div className="flex justify-between items-center pt-8 border-t border-slate-50">
                <button
                  onClick={() => setStep(2)}
                  className="px-10 py-5 rounded-[24px] text-slate-400 font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
                >
                  <ChevronLeft size={18} />
                  Précédent
                </button>
                <button
                  onClick={handleReserve}
                  disabled={saving || !selectedVehicle || !startDate || !endDate}
                  className="px-12 py-5 rounded-[24px] bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest hover:bg-primary shadow-2xl hover:shadow-primary/30 disabled:opacity-30 transition-all flex items-center gap-3"
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                  {saving ? "Réservation..." : "Générer la Location"}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Final Confirmation */}
          {step === 4 && reservation && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-12 text-center"
            >
              <div className="relative py-12">
                <div className="absolute inset-0 bg-primary/5 rounded-[56px] blur-3xl -z-10" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
                  className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/30"
                >
                  <CheckCircle2 size={48} />
                </motion.div>
                <h3 className="text-5xl font-black text-slate-900 tracking-tighter mb-4 uppercase italic">Location Créée</h3>
                <p className="text-slate-400 font-medium text-lg">
                  Référence de transaction : <span className="text-slate-900 font-black">#{reservation.id?.toString().padStart(5, "0")}</span>
                </p>
              </div>

              <div className="max-w-xl mx-auto bg-white p-10 rounded-[48px] border border-slate-100 shadow-[0_40px_100px_rgba(0,0,0,0.03)] space-y-6">
                <div className="grid grid-cols-2 gap-y-6 text-left">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Client VIP</p>
                    <p className="text-sm font-bold text-slate-900">{clientData.name}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Véhicule</p>
                    <p className="text-sm font-bold text-slate-900">{selectedVehicle?.brand} {selectedVehicle?.model}</p>
                  </div>
                  <div className="space-y-1 border-t border-slate-50 pt-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Période</p>
                    <p className="text-sm font-bold text-slate-900">{reservation.start_date} → {reservation.end_date}</p>
                  </div>
                  <div className="space-y-1 text-right border-t border-slate-50 pt-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Méthode</p>
                    <div className="flex items-center justify-end gap-2">
                      <CreditCard size={12} className="text-emerald-500" />
                      <p className="text-sm font-bold text-slate-900">Sur Place</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Montant Total</span>
                  <span className="text-3xl font-black text-slate-900">{reservation.total_price?.toLocaleString("fr-FR")} DH</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 max-w-md mx-auto">
                <button
                  onClick={handleContract}
                  disabled={saving || !!success}
                  className="w-full py-6 rounded-[24px] bg-slate-900 text-white font-black uppercase text-[10px] tracking-[0.3em] hover:bg-primary shadow-2xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-3 group"
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <FileCheck size={18} className="group-hover:scale-110 transition-transform" />}
                  {saving ? "Génération..." : success ? "Contrat Envoyé" : "Générer le Contrat PDF"}
                </button>
                <button
                  onClick={reset}
                  className="w-full py-6 rounded-[24px] bg-slate-100 text-slate-400 font-black uppercase text-[10px] tracking-[0.3em] hover:bg-slate-200 hover:text-slate-900 transition-all"
                >
                  Nouvelle Location
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
