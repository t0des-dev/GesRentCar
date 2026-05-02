"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Check, Car, Calendar, User, CreditCard, Loader2, Shield, Navigation, Plane, X, Info, ChevronRight, Lock, FileText, ScanLine, Camera, Rotate3d, Maximize2, PenTool, RotateCcw, Users, Fuel, Settings2, Globe } from "lucide-react";
import SignaturePad from "@/components/SignaturePad";
import { useVehicles } from "@/hooks/useApi";
import { StripeCheckout } from "@/components/StripeCheckout";
import { CmiCheckout } from "@/components/CmiCheckout";

// ─── Types ───────────────────────────────────────────────────────────────────
interface BookingState {
  vehicleId: number | null;
  startDate: string;
  endDate: string;
  location: string;
  options: string[];
  client: { name: string; email: string; phone: string; cin: string; licenseNumber: string; };
  paymentMethod: "deposit_card" | "full_card";
}

// ─── Step Indicator ──────────────────────────────────────────────────────────
const STEPS = [
  { label: "Véhicule", icon: "Car" },
  { label: "Période", icon: "Calendar" },
  { label: "Options", icon: "Shield" },
  { label: "Détails", icon: "User" },
  { label: "Signature", icon: "PenTool" },
  { label: "Paiement", icon: "CreditCard" },
];

const MOCK_OPTIONS = [
  { id: "chauffeur", label: "Chauffeur Privé", price: 1500, type: "per_day", icon: "User", desc: "Un chauffeur bilingue et discret à votre entière disposition 24/7." },
  { id: "airport_vip", label: "Accueil Aéroport VIP", price: 500, type: "fixed", icon: "Plane", desc: "Service Meet & Greet au terminal avec coupe-file prioritaire." },
  { id: "champagne", label: "Service Champagne", price: 1200, type: "fixed", icon: "FileText", desc: "Bouteille Moët & Chandon servie bien fraîche à la remise des clés." },
  { id: "vip_insure", label: "Assurance Platinium", price: 300, type: "per_day", icon: "Shield", desc: "Couverture totale sans franchise, assistance 0km incluse." },
];

// ─── Vehicle Showroom Modal ──────────────────────────────────────────────────
function VehicleShowroom({ vehicle, onClose, onSelect }: { vehicle: any; onClose: () => void; onSelect: () => void }) {
  const [is360, setIs360] = useState(false);
  
  if (!vehicle) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl" onClick={onClose} />
      
      <div className="bg-white rounded-[48px] w-full max-w-6xl relative z-10 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row animate-in zoom-in-95 duration-500 border border-white/20">
        
        {/* Left: Cinematic Visuals */}
        <div className="w-full md:w-3/5 h-[350px] md:h-[650px] relative bg-slate-100 overflow-hidden group">
          
          {/* Main Visual Container */}
          <div className={cn(
            "absolute inset-0 transition-all duration-1000 ease-in-out",
            is360 ? "scale-125 rotate-2" : "scale-100"
          )}>
            <img 
              src={vehicle.img} 
              alt={vehicle.model} 
              className={cn(
                "w-full h-full object-cover transition-transform duration-[10s] linear infinite",
                is360 ? "animate-slow-zoom" : ""
              )}
            />
          </div>

          {/* 360 Overlay Effect */}
          {is360 && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/60 pointer-events-none">
              <div className="absolute top-1/2 left-0 w-full h-px bg-white/20 shadow-[0_0_15px_white]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[500px] h-[500px] border border-white/10 rounded-full animate-ping opacity-20"></div>
              </div>
            </div>
          )}

          {/* Controls Overlay */}
          <div className="absolute inset-0 p-8 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-lg">
                Showroom Vectoria
              </span>
              <button onClick={onClose} className="w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all border border-white/20 group">
                <X size={24} className="group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setIs360(!is360)}
                className={cn(
                  "flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all shadow-2xl",
                  is360 
                    ? "bg-amber-500 text-slate-900 scale-110" 
                    : "bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20"
                )}
              >
                <Rotate3d size={20} className={is360 ? "animate-spin-slow" : ""} />
                {is360 ? "Quitter Mode 360°" : "Activer Vue 360°"}
              </button>
            </div>
          </div>

          {/* Bottom Shadow Gradient */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
        </div>
        
        {/* Right: Premium Specs & Actions */}
        <div className="w-full md:w-2/5 p-8 md:p-14 flex flex-col bg-white">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-px w-8 bg-amber-500"></span>
              <span className="text-amber-600 font-black text-[10px] uppercase tracking-widest">{vehicle.type} Luxury</span>
            </div>
            <h2 className="text-5xl font-black text-slate-900 leading-tight mb-2 tracking-tighter">{vehicle.brand}</h2>
            <h3 className="text-2xl font-bold text-slate-400">{vehicle.model}</h3>
          </div>
          
          <div className="space-y-6 mb-12">
            <p className="text-slate-500 font-medium leading-relaxed italic border-l-4 border-slate-100 pl-6 text-lg">
              "{vehicle.desc}"
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(vehicle.specs).map(([key, val]) => (
                <div key={key} className="bg-slate-50 p-5 rounded-[24px] border border-slate-100/50 hover:bg-white hover:border-amber-200 transition-all group">
                  <span className="block text-[9px] uppercase font-black text-slate-400 mb-1 tracking-widest group-hover:text-amber-500 transition-colors">{key}</span>
                  <span className="font-black text-slate-900 text-sm">{val as string}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-10 border-t border-slate-100 flex flex-col gap-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900">{vehicle.price}</span>
              <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">DH / JOUR</span>
            </div>
            
            <button 
              onClick={() => { onSelect(); onClose(); }} 
              className="w-full bg-slate-900 text-white py-6 rounded-[24px] font-black text-lg shadow-2xl hover:bg-primary transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
            >
              Réserver ce modèle
              <ChevronRight size={20} />
            </button>
            <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-tighter">Confirmation instantanée • Sans frais cachés</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BookingPage() {
  const [step, setStep] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [reservationId, setReservationId] = useState<number | null>(null);
  const [previewVehicle, setPreviewVehicle] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<"stripe" | "cmi">("stripe");
  const createReservation = { isPending: false }; // kept for type compat — payment now via Stripe
  const { data: vehiclesData, isLoading: isLoadingVehicles } = useVehicles({ status: 'available' });

  const getIcon = (name: string) => {
    const icons: any = { Car, Calendar, Shield, User, CreditCard, Plane, FileText, PenTool };
    return icons[name] || Info;
  };

  const [signature, setSignature] = useState<string | null>(null);
  
  const displayVehicles = useMemo(() => {
    if (!vehiclesData?.data) return [];
    return vehiclesData.data.map(v => ({
      id: v.id,
      brand: v.brand,
      model: v.model,
      price: v.price_per_day,
      type: "Premium",
      img: v.image_url ? `http://localhost:8000${v.image_url}` : "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=600",
      specs: { transmission: v.transmission || "Auto", fuel: v.fuel_type || "Diesel", seats: v.seats || 5, mileage: v.mileage },
      desc: v.description_fr || "L'élégance et le confort absolu pour vos trajets."
    }));
  }, [vehiclesData]);

  const [booking, setBooking] = useState<BookingState>({
    vehicleId: null, startDate: "", endDate: "", location: "", options: [],
    client: { name: "", email: "", phone: "", cin: "", licenseNumber: "" },
    paymentMethod: "deposit_card",
  });

  const update = (key: keyof BookingState, val: unknown) => setBooking(prev => ({ ...prev, [key]: val }));
  
  const handleScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setIsScanning(true);
    setScanSuccess(false);
    
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    formData.append("type", "cin");

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      const res = await fetch(`${apiBase}/ocr/scan`, {
        method: "POST",
        body: formData,
        // If auth is needed, add Authorization header, but OcrController seems open or we can pass token if needed.
        // Assuming public or demo for now.
      });
      const data = await res.json();
      
      if (data.success && data.data) {
        update("client", {
          ...booking.client,
          name: data.data.name || booking.client.name,
          cin: data.data.id_number || booking.client.cin,
          licenseNumber: data.data.license_number || booking.client.licenseNumber,
        });
        setScanSuccess(true);
        setTimeout(() => setScanSuccess(false), 3000);
      }
    } catch (err) {
      console.error("OCR Error", err);
      alert("Erreur de connexion au serveur OCR.");
    } finally {
      setIsScanning(false);
    }
  };
  
  // Calculations for Dynamic Pricing
  const vehicle = displayVehicles.find(v => v.id === booking.vehicleId);
  const days = useMemo(() => {
    if (!booking.startDate || !booking.endDate) return 0;
    const diff = new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime();
    return Math.max(1, Math.round(diff / 86400000));
  }, [booking.startDate, booking.endDate]);

  const basePrice = vehicle ? vehicle.price * days : 0;
  
  // Simulate high season (+15%) if booking in July/August
  const isHighSeason = booking.startDate && (new Date(booking.startDate).getMonth() === 6 || new Date(booking.startDate).getMonth() === 7);
  const seasonMultiplier = isHighSeason ? 1.15 : 1;
  const dynamicBasePrice = Math.round(basePrice * seasonMultiplier);
  
  const optionsPrice = booking.options.reduce((sum, optId) => {
    const opt = MOCK_OPTIONS.find(o => o.id === optId);
    if (!opt) return sum;
    return sum + (opt.type === "per_day" ? opt.price * days : opt.price);
  }, 0);
  const total = dynamicBasePrice + optionsPrice;
  const deposit = Math.round(total * 0.1);

  const canNext = () => {
    if (step === 0) return booking.vehicleId !== null;
    if (step === 1) return !!booking.startDate && !!booking.endDate && !!booking.location;
    if (step === 2) return true;
    if (step === 3) return !!(booking.client.name && booking.client.phone && booking.client.cin);
    if (step === 4) return !!signature;
    return true;
  };

  // Stripe handles payment + reservation creation
  // handleSubmit is a no-op now — kept for nav button compat
  const handleSubmit = () => {};

  if (confirmed) {
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

  return (
    <main className="min-h-screen pt-36 pb-24 bg-background relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-1/2 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-1/2 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/4" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="mb-16 text-center">
          <p className="text-primary font-black text-xs uppercase tracking-[0.2em] mb-4">Votre Réservation</p>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-foreground mb-4">Réservez <span className="text-gradient-gold">l'Exception</span></h1>
          <p className="text-muted-foreground font-medium text-lg max-w-xl mx-auto">Sécurisez votre véhicule de luxe en quelques étapes simples. Notre conciergerie s'occupe du reste.</p>
        </div>

        {/* 2-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Column: Form Steps */}
          <div className="w-full lg:w-2/3">
            <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4 hide-scrollbar">
              {STEPS.map((s, i) => (
                <div key={s.label} className="flex flex-col items-center gap-2 min-w-[70px]">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500", i < step ? "bg-slate-900 border-slate-900 text-white shadow-lg" : i === step ? "border-primary text-primary bg-primary/5 scale-110" : "border-slate-200 text-slate-400 bg-white")}>
                    {i < step ? <Check size={20} strokeWidth={3} /> : (function() { const Icon = getIcon(s.icon); return <Icon size={20} />; })()}
                  </div>
                  <span className={cn("text-[10px] font-black uppercase tracking-widest", i === step ? "text-primary" : i < step ? "text-slate-900" : "text-slate-400")}>{s.label}</span>
                </div>
              ))}
            </div>

            <div className="mb-8 min-h-[400px]">
              {/* STEP 0: VEHICLE */}
              {step === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
                  {isLoadingVehicles ? (
                    <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center py-20 text-slate-400">
                      <Loader2 className="animate-spin mb-4" size={32} />
                      <p>Chargement des véhicules disponibles...</p>
                    </div>
                  ) : displayVehicles.length === 0 ? (
                    <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center py-20 text-slate-400">
                      <Car size={48} className="mb-4 opacity-50" />
                      <p>Aucun véhicule disponible pour le moment.</p>
                    </div>
                  ) : (
                    displayVehicles
                      .filter(v => !booking.vehicleId || booking.vehicleId === v.id)
                      .map((v) => (
                        <div key={v.id} className={cn(
                          "bg-white rounded-[40px] overflow-hidden border border-slate-100 transition-all duration-700 relative group", 
                          booking.vehicleId === v.id 
                            ? "ring-8 ring-primary/5 md:col-span-2 max-w-2xl mx-auto w-full shadow-2xl scale-[1.02] border-primary/20" 
                            : "hover:shadow-xl hover:border-slate-200 hover:-translate-y-1"
                        )}>
                          <div className={cn("relative cursor-pointer overflow-hidden", booking.vehicleId === v.id ? "h-80" : "h-56")} onClick={() => setPreviewVehicle(v)}>
                            <img src={v.img} alt={v.model} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out" />
                            
                            {/* Glass overlay on hover */}
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
                              <button className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-black text-sm shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 flex items-center gap-2">
                                <Maximize2 size={18} />
                                Voir Détails 360°
                              </button>
                            </div>

                            {booking.vehicleId === v.id && (
                              <div className="absolute top-6 left-6 bg-primary text-white px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 animate-in fade-in zoom-in duration-500">
                                ✓ Sélectionné
                              </div>
                            )}

                            {/* Price Badge Overlay */}
                            <div className="absolute bottom-6 right-6 glass-dark px-4 py-2 rounded-2xl border border-white/20">
                              <span className="text-white font-black text-lg">{v.price} <span className="text-[10px] opacity-60">DH/j</span></span>
                            </div>
                          </div>

                          <div className="p-8">
                            <div className="flex justify-between items-end mb-8">
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">{v.type}</p>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{v.brand} <span className="text-slate-400 font-bold">{v.model}</span></h3>
                              </div>
                            </div>

                            {/* Technical Specs Bar */}
                            <div className="grid grid-cols-3 gap-3 mb-8">
                              <div className="bg-slate-50 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 border border-slate-100">
                                <Users size={16} className="text-slate-400" />
                                <span className="text-[10px] font-black text-slate-900">{v.specs?.seats || 5} PLACES</span>
                              </div>
                              <div className="bg-slate-50 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 border border-slate-100">
                                <Settings2 size={16} className="text-slate-400" />
                                <span className="text-[10px] font-black text-slate-900 uppercase">{v.specs?.transmission || "AUTO"}</span>
                              </div>
                              <div className="bg-slate-50 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 border border-slate-100">
                                <Fuel size={16} className="text-slate-400" />
                                <span className="text-[10px] font-black text-slate-900 uppercase">{v.specs?.fuel || "DIESEL"}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              {booking.vehicleId === v.id ? (
                                <>
                                  <button onClick={() => update("vehicleId", null)} className="flex-1 bg-slate-100 text-slate-500 py-5 rounded-[20px] font-black text-xs uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center gap-2">
                                    <RotateCcw size={16} />
                                    Annuler
                                  </button>
                                  <button onClick={() => setStep(1)} className="flex-[2] bg-slate-900 text-white py-5 rounded-[20px] font-black text-xs uppercase tracking-widest shadow-2xl shadow-slate-900/30 hover:bg-primary transition-all flex items-center justify-center gap-2 group/btn">
                                    Confirmer & Continuer
                                    <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                  </button>
                                </>
                              ) : (
                                <button onClick={() => update("vehicleId", v.id)} className="w-full bg-slate-900 text-white py-5 rounded-[20px] font-black text-xs uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl hover:shadow-primary/30 flex items-center justify-center gap-3">
                                  <Car size={18} />
                                  Réserver ce modèle
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              )}

              {/* STEP 1: DATES */}
              {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
                  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-500">Date de départ</label>
                    <input type="date" value={booking.startDate} onChange={(e) => update("startDate", e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none" suppressHydrationWarning />
                  </div>
                  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-500">Date de retour</label>
                    <input type="date" value={booking.endDate} min={booking.startDate || undefined} onChange={(e) => update("endDate", e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none" suppressHydrationWarning />
                  </div>
                  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-3 md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-slate-500">Lieu de prise en charge</label>
                    <input type="text" placeholder="Ex: Aéroport Mohammed V..." value={booking.location} onChange={(e) => update("location", e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none" />
                  </div>
                </div>
              )}

              {/* STEP 2: VIP CONCIERGERIE OPTIONS */}
              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-bottom-4">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                      <Shield className="text-amber-500" size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">Services Exclusifs</h3>
                      <p className="text-sm text-slate-500 font-medium">Sublimez votre séjour avec notre conciergerie privée.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {MOCK_OPTIONS.map((opt) => {
                      const isSelected = booking.options.includes(opt.id);
                      return (
                        <button key={opt.id} onClick={() => {
                          update("options", isSelected ? booking.options.filter(o => o !== opt.id) : [...booking.options, opt.id]);
                        }} className={cn("relative overflow-hidden flex flex-col p-6 rounded-[28px] border-2 transition-all text-left group", isSelected ? "border-amber-500 bg-amber-500/5 shadow-xl shadow-amber-500/10" : "border-slate-100 bg-white hover:border-amber-200 hover:shadow-lg")}>
                          
                          {isSelected && (
                            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500 rounded-bl-[100px] flex items-start justify-end p-3 text-white">
                              <Check size={16} strokeWidth={4} />
                            </div>
                          )}

                          <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300", isSelected ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30" : "bg-slate-50 text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600")}>
                            {(function() { const Icon = getIcon(opt.icon); return <Icon size={28} />; })()}
                          </div>
                          
                          <div className="mb-auto">
                            <p className="text-lg font-black text-slate-900 mb-1">{opt.label}</p>
                            <p className="text-sm font-medium text-slate-500 leading-relaxed pr-6">{opt.desc}</p>
                          </div>
                          
                          <div className="mt-6 pt-4 border-t border-slate-100 flex items-end justify-between">
                            <p className={cn("text-xl font-black", isSelected ? "text-amber-600" : "text-slate-900")}>
                              +{opt.price.toLocaleString()} <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{opt.type === "per_day" ? "DH/jour" : "DH (forfait)"}</span>
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: DETAILS & IA SCAN */}
              {step === 3 && (
                <div className="animate-in fade-in slide-in-from-bottom-4">
                  
                  {/* AI Scanner Box */}
                  <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-[32px] p-8 mb-6 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                    
                    {/* Scanning Laser Animation */}
                    {isScanning && <div className="absolute top-0 left-0 w-full h-1 bg-amber-400 shadow-[0_0_15px_#fbbf24] animate-[scan_1.5s_ease-in-out_infinite]" />}
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="text-white text-center md:text-left">
                        <h3 className="text-xl font-black mb-2 flex items-center justify-center md:justify-start gap-2">
                          <ScanLine className="text-amber-400" />
                          Remplissage IA
                        </h3>
                        <p className="text-slate-400 text-sm font-medium">Uploadez votre permis ou CIN. Notre IA extraira vos informations en 2 secondes pour vous faire gagner du temps.</p>
                      </div>
                      
                      <div className="relative shrink-0">
                        <input type="file" accept="image/*" onChange={handleScan} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" disabled={isScanning} />
                        <button disabled={isScanning} className={cn("flex items-center gap-2 px-6 py-4 rounded-2xl font-black transition-all", isScanning ? "bg-slate-700 text-slate-400 cursor-not-allowed" : scanSuccess ? "bg-emerald-500 text-white" : "bg-amber-500 text-slate-900 hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/20")}>
                          {isScanning ? <><Loader2 className="animate-spin" size={20}/> Analyse en cours...</> : scanSuccess ? <><Check size={20}/> Extraction réussie</> : <><Camera size={20}/> Scanner mon document</>}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Manual Fields */}
                  <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                    {scanSuccess && <div className="absolute inset-0 bg-emerald-500/5 rounded-[32px] animate-pulse pointer-events-none" />}
                    {[ { k: "name", l: "Nom Complet", p: "John Doe" }, { k: "email", l: "Email", p: "contact@exemple.com", t: "email" }, { k: "phone", l: "Téléphone", p: "+212 6 00 00 00 00", t: "tel" }, { k: "cin", l: "CIN / Passeport", p: "AB123456" }, { k: "licenseNumber", l: "Permis de conduire", p: "12345678" } ].map((f) => (
                      <div key={f.k} className={cn("space-y-2", f.k === "name" || f.k === "email" ? "md:col-span-1" : "")}>
                        <label className="text-[10px] font-black uppercase text-slate-500 ml-2 flex items-center gap-2">
                          {f.l}
                          {scanSuccess && (f.k === "name" || f.k === "cin" || f.k === "licenseNumber") && <span className="text-emerald-500 text-[9px] bg-emerald-50 px-1 rounded">IA ✓</span>}
                        </label>
                        <input type={f.t || "text"} placeholder={f.p} value={booking.client[f.k as keyof typeof booking.client]} onChange={(e) => update("client", { ...booking.client, [f.k]: e.target.value })} className={cn("w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold focus:border-primary outline-none transition-all", scanSuccess && (f.k === "name" || f.k === "cin" || f.k === "licenseNumber") ? "ring-2 ring-emerald-500/50 bg-emerald-50" : "")} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: SIGNATURE */}
              {step === 4 && (
                <div className="animate-in fade-in slide-in-from-bottom-4">
                  <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-8">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
                        <PenTool size={24} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Signature Électronique</h3>
                        <p className="text-sm text-slate-500 font-medium">Authentifiez votre réservation avec une signature tactile.</p>
                      </div>
                    </div>

                    <SignaturePad 
                      onSave={(data) => setSignature(data)}
                      onClear={() => setSignature(null)}
                    />
                  </div>
                </div>
              )}

              {/* STEP 5: PAYMENT — Choice between Stripe and CMI */}
              {step === 5 && (
                <div className="animate-in fade-in">
                  <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
                      <Lock className="text-green-500" size={24} />
                      <div>
                        <h3 className="text-xl font-black text-slate-900">Garantie "Hold my Car"</h3>
                        <p className="text-sm text-slate-500 font-medium">Bloquez votre véhicule en réglant l'acompte de 10%.</p>
                      </div>
                    </div>

                    {/* Gateway Selector */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <button
                        onClick={() => setSelectedGateway("stripe")}
                        className={cn(
                          "flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all",
                          selectedGateway === "stripe" 
                            ? "border-slate-900 bg-slate-900 text-white shadow-xl shadow-slate-900/20" 
                            : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
                        )}
                      >
                        <CreditCard size={24} />
                        <span className="text-xs font-black uppercase tracking-widest">Stripe (International)</span>
                      </button>
                      <button
                        onClick={() => setSelectedGateway("cmi")}
                        className={cn(
                          "flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all",
                          selectedGateway === "cmi" 
                            ? "border-blue-600 bg-blue-600 text-white shadow-xl shadow-blue-600/20" 
                            : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
                        )}
                      >
                        <Globe size={24} />
                        <span className="text-xs font-black uppercase tracking-widest">CMI (Maroc Local)</span>
                      </button>
                    </div>

                    {deposit > 0 && booking.vehicleId ? (
                      selectedGateway === "stripe" ? (
                        <StripeCheckout
                          deposit={deposit}
                          bookingPayload={{
                            vehicle_id: booking.vehicleId,
                            start_date: booking.startDate,
                            end_date: booking.endDate,
                            signature: signature || undefined,
                            client: {
                              name: booking.client.name,
                              email: booking.client.email,
                              phone: booking.client.phone,
                              cin: booking.client.cin,
                              license_number: booking.client.licenseNumber,
                            },
                          }}
                          onSuccess={(resId?: number) => { if (resId) setReservationId(resId); setConfirmed(true); }}
                        />
                      ) : (
                        <CmiCheckout 
                          reservationId={reservationId || 0}
                          deposit={deposit}
                        />
                      )
                    ) : (
                      <p className="text-slate-400 text-center py-8">Sélectionnez un véhicule et des dates pour continuer.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Footer — hidden on payment step (Stripe button takes over) */}
            {step < 5 && (
              <div className="flex justify-between items-center pt-6 border-t-2 border-slate-100">
                <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="px-8 py-4 rounded-2xl text-slate-400 font-black hover:bg-slate-100 disabled:opacity-0 transition-all">Retour</button>
                {step > 0 && (
                  <button onClick={() => setStep(step + 1)} disabled={!canNext()} className="px-10 py-4 rounded-2xl bg-primary text-white font-black hover:shadow-xl hover:shadow-primary/30 disabled:opacity-30 disabled:hover:shadow-none transition-all flex items-center gap-2">
                    Étape Suivante
                  </button>
                )}
              </div>
            )}
            {step === 5 && (
              <div className="pt-6 border-t-2 border-slate-100">
                <button onClick={() => setStep(4)} className="px-8 py-4 rounded-2xl text-slate-400 font-black hover:bg-slate-100 transition-all">← Retour</button>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Live Calculator */}
          <div className="w-full lg:w-1/3 lg:sticky lg:top-8">
            <div className="bg-slate-900 text-white rounded-[36px] p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2"><Info size={14}/> Simulateur en temps réel</h3>
              
              <div className="space-y-5 relative z-10">
                {vehicle ? (
                  <>
                    <div className="flex justify-between items-end border-b border-slate-800 pb-5">
                      <div>
                        <p className="font-bold text-lg">{vehicle.brand} {vehicle.model}</p>
                        <p className="text-slate-400 text-sm mt-1">{days} jour(s) x {vehicle.price} DH</p>
                      </div>
                      <p className="font-black text-xl">{basePrice.toLocaleString()} DH</p>
                    </div>

                    {isHighSeason && (
                      <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-5">
                        <span className="text-orange-400 font-bold bg-orange-400/10 px-2 py-1 rounded-md">Surcharge Haute Saison (+15%)</span>
                        <span className="font-bold text-orange-400">+{(dynamicBasePrice - basePrice).toLocaleString()} DH</span>
                      </div>
                    )}

                    {booking.options.length > 0 && (
                      <div className="border-b border-slate-800 pb-5 space-y-3">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">Options Conciergerie</p>
                        {booking.options.map(optId => {
                          const opt = MOCK_OPTIONS.find(o => o.id === optId);
                          if (!opt) return null;
                          const optTotal = opt.type === "per_day" ? opt.price * days : opt.price;
                          return (
                            <div key={optId} className="flex justify-between items-center text-sm">
                              <span className="text-slate-300 flex items-center gap-2">
                                {(function() { const Icon = getIcon(opt.icon); return <Icon size={12} className="text-primary"/>; })()} {opt.label}
                                {opt.type === "fixed" && <span className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">Forfait</span>}
                              </span>
                              <span className="font-bold">{optTotal.toLocaleString()} DH</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="pt-2">
                      <p className="text-slate-400 font-bold mb-1">Montant Total Estimé</p>
                      <p className="text-4xl font-black tracking-tighter">{total.toLocaleString()} <span className="text-xl text-primary">DH</span></p>
                    </div>

                    <div className="mt-6 bg-primary/20 border border-primary/30 rounded-2xl p-4 flex justify-between items-center">
                      <span className="text-primary font-bold text-sm">Acompte pour bloquer (10%)</span>
                      <span className="text-white font-black text-xl">{deposit.toLocaleString()} DH</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    <Car size={40} className="mx-auto mb-4 opacity-50" />
                    <p className="font-medium text-sm">Sélectionnez un véhicule pour estimer le prix.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {previewVehicle && <VehicleShowroom vehicle={previewVehicle} onClose={() => setPreviewVehicle(null)} onSelect={() => { update("vehicleId", previewVehicle.id); setPreviewVehicle(null); }} />}
    </main>
  );
}

