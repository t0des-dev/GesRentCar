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
      setSuccess("Contrat généré et envoyé !");
    } catch {
      setError("Erreur lors de la génération du contrat.");
    }
    finally { setSaving(false); }
  };

  const totalPrice = selectedVehicle && startDate && endDate
    ? (selectedVehicle.dynamic_price || selectedVehicle.price_per_day) * daysBetween(startDate, endDate) : 0;

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex justify-between items-end border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Nouvelle Location</h2>
          <p className="text-slate-400 text-sm">Parcours de réservation assisté par IA.</p>
        </div>
        <div className="flex items-center gap-1.5 bg-primary/5 text-primary px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-widest border border-primary/10">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Agent Connecté
        </div>
      </div>

      {/* Modern Stepper */}
      <div className="flex items-center justify-between max-w-xl mx-auto mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-px bg-slate-100" />
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = step === s.id;
          const isDone = step > s.id;

          return (
            <div key={s.id} className="flex flex-col items-center gap-3 relative">
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 border-2",
                  isActive ? "bg-slate-900 border-slate-900 text-white shadow-sm scale-110" :
                    isDone ? "bg-primary border-primary text-white" :
                      "bg-white border-slate-100 text-slate-300"
                )}
              >
                {isDone ? <CheckCircle2 size={20} /> : <Icon size={20} />}
              </div>
              <span className={cn(
                "text-[10px] font-semibold uppercase tracking-widest",
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
            className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 flex items-center gap-3 text-sm font-semibold"
          >
            <AlertCircle size={18} />
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 flex items-center gap-3 text-sm font-semibold"
          >
            <CheckCircle2 size={18} />
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-[450px]">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 bg-slate-50 text-slate-400 px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase">
                    Étape 01
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 leading-tight">Numérisation des Documents</h3>
                  <p className="text-slate-500 leading-relaxed max-w-sm">
                    Utilisez l'appareil photo pour scanner la CIN ou le permis de conduire du client. Notre IA extraira automatiquement les informations.
                  </p>
                  
                  <div className="pt-2 flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-[10px] font-semibold">1</div>
                      Placez le document à plat
                    </div>
                    <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-[10px] font-semibold">2</div>
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
                      "aspect-video rounded-2xl border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden",
                      scanning ? "border-primary bg-primary/5" : "border-slate-100 bg-slate-50 hover:border-primary/30 hover:bg-white"
                    )}
                  >
                    {scanning ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                          <motion.div 
                            animate={{ top: ["0%", "100%", "0%"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent blur-sm"
                          />
                        </div>
                        <Loader2 size={40} className="text-primary animate-spin" />
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">Analyse OCR en cours...</p>
                      </div>
                    ) : (
                      <>
                        <Camera size={48} className="text-slate-300 mb-3 group-hover:scale-110 group-hover:text-primary transition-all" />
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Cliquez pour capturer</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-6 border-t border-slate-100">
                <button
                  onClick={() => setStep(2)}
                  className="px-8 py-3.5 rounded-xl text-slate-400 font-semibold uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
                >
                  Passer manuellement
                  <ChevronRight size={16} />
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
              className="space-y-10"
            >
              <div className="bg-slate-50/50 p-8 rounded-2xl border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                  {[
                    { key: "name", label: "Nom Complet", Icon: User, type: "text", ph: "Jean Dupont" },
                    { key: "cin", label: "N° CIN", Icon: CreditCard, type: "text", ph: "AB123456" },
                    { key: "email", label: "Adresse Email", Icon: Mail, type: "email", ph: "client@email.com" },
                    { key: "phone", label: "Téléphone", Icon: Phone, type: "tel", ph: "0600000000" },
                  ].map(({ key, label, Icon, type, ph }) => (
                    <div key={key}>
                      <label className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
                        <Icon size={12} className="text-primary" />
                        {label}
                      </label>
                      <input
                        type={type}
                        value={(clientData as any)[key]}
                        onChange={(e) => setClientData({ ...clientData, [key]: e.target.value })}
                        placeholder={ph}
                        className="input-premium w-full px-5 py-3.5 text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                <button
                  onClick={() => setStep(1)}
                  className="px-8 py-3.5 rounded-xl text-slate-400 font-semibold uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
                >
                  <ChevronLeft size={16} />
                  Précédent
                </button>
                <button
                  onClick={handleSaveClient}
                  disabled={saving || !clientData.name || !clientData.cin}
                  className="btn-primary flex items-center gap-2 text-[10px]"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
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
              className="space-y-10"
            >
              {/* Date Selection Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900 p-8 rounded-2xl text-white">
                <div>
                  <label className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
                    <Calendar size={12} className="text-primary" />
                    Début du Contrat
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-white/10 border border-white/10 px-5 py-3.5 rounded-xl text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
                    <Calendar size={12} className="text-primary" />
                    Fin du Contrat
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-white/10 border border-white/10 px-5 py-3.5 rounded-xl text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Vehicle List */}
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-900 tracking-tight">Sélection du Véhicule</h4>
                  <span className="text-[10px] font-semibold text-slate-400">{vehicles.length} véhicules disponibles</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {vehicles.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVehicle(v)}
                      className={cn(
                        "p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex justify-between items-center group",
                        selectedVehicle?.id === v.id
                          ? "border-primary bg-primary/5"
                          : "border-slate-50 bg-slate-50/50 hover:border-slate-200 hover:bg-white"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                          selectedVehicle?.id === v.id ? "bg-primary text-white" : "bg-white text-slate-400 shadow-sm"
                        )}>
                          <Car size={20} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{v.brand} {v.model}</p>
                          <p className="text-[10px] font-medium text-slate-400 tracking-widest uppercase">{v.plate}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">
                          {(v.dynamic_price || v.price_per_day)?.toLocaleString("fr-FR")} DH
                        </p>
                        <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">par jour</p>
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
                  className="bg-primary/5 p-6 rounded-2xl border border-primary/10 flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Hash size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-primary uppercase tracking-widest">Résumé financier</p>
                      <p className="text-sm font-medium text-slate-600">Total pour {daysBetween(startDate, endDate)} jours</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">{totalPrice.toLocaleString("fr-FR")} DH</p>
                  </div>
                </motion.div>
              )}

              <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                <button
                  onClick={() => setStep(2)}
                  className="px-8 py-3.5 rounded-xl text-slate-400 font-semibold uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
                >
                  <ChevronLeft size={16} />
                  Précédent
                </button>
                <button
                  onClick={handleReserve}
                  disabled={saving || !selectedVehicle || !startDate || !endDate}
                  className="btn-primary flex items-center gap-2 text-[10px]"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                  {saving ? "Réservation..." : "Générer la Location"}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Final Confirmation */}
          {step === 4 && reservation && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-10 text-center"
            >
              <div className="py-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
                  className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                >
                  <CheckCircle2 size={40} />
                </motion.div>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Location Créée</h3>
                <p className="text-slate-400">
                  Référence de transaction : <span className="text-slate-900 font-bold">#{reservation.id?.toString().padStart(5, "0")}</span>
                </p>
              </div>

              <div className="max-w-lg mx-auto bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-5">
                <div className="grid grid-cols-2 gap-y-5 text-left">
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Client VIP</p>
                    <p className="text-sm font-semibold text-slate-900">{clientData.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Véhicule</p>
                    <p className="text-sm font-semibold text-slate-900">{selectedVehicle?.brand} {selectedVehicle?.model}</p>
                  </div>
                  <div className="border-t border-slate-50 pt-4">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Période</p>
                    <p className="text-sm font-semibold text-slate-900">{reservation.start_date} → {reservation.end_date}</p>
                  </div>
                  <div className="text-right border-t border-slate-50 pt-4">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Méthode</p>
                    <div className="flex items-center justify-end gap-1.5">
                      <CreditCard size={12} className="text-emerald-500" />
                      <p className="text-sm font-semibold text-slate-900">Sur Place</p>
                    </div>
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Montant Total</span>
                  <span className="text-2xl font-bold text-slate-900">{reservation.total_price?.toLocaleString("fr-FR")} DH</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 max-w-sm mx-auto">
                <button
                  onClick={handleContract}
                  disabled={saving || !!success}
                  className="btn-primary flex items-center justify-center gap-2 text-[10px]"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <FileCheck size={16} />}
                  {saving ? "Génération..." : success ? "Contrat Envoyé" : "Générer le Contrat PDF"}
                </button>
                <button
                  onClick={reset}
                  className="btn-secondary text-[10px]"
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
