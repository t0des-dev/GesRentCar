"use client";

import { useState, useCallback, useRef } from "react";
import {
  ScanLine, User, Car, FileCheck, ChevronLeft, ChevronRight,
  Loader2, CheckCircle2, AlertCircle, Camera, Calendar, CreditCard, Phone,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./NewRental.module.css";

const API = "http://localhost:8000/api";
const getToken = () => typeof window !== "undefined" ? localStorage.getItem("vectoria_token") || "" : "";

type ClientData = { name: string; cin: string; license?: string; email?: string; phone?: string; };
type Vehicle    = { id: number; brand: string; model: string; plate: string; price_per_day: number; dynamic_price: number; type: string; };

const STEPS = [
  { id: 1, label: "Scan",     icon: ScanLine },
  { id: 2, label: "Client",   icon: User },
  { id: 3, label: "Véhicule", icon: Car },
  { id: 4, label: "Contrat",  icon: FileCheck },
];

const daysBetween = (a: string, b: string) => {
  if (!a || !b) return 0;
  return Math.max(Math.ceil((new Date(b).getTime() - new Date(a).getTime()) / 86400000), 0);
};

export default function NewRental() {
  const [step, setStep]                 = useState(1);
  const [scanning, setScanning]         = useState(false);
  const [saving, setSaving]             = useState(false);
  const [error, setError]               = useState("");
  const [success, setSuccess]           = useState("");
  const [clientData, setClientData]     = useState<ClientData>({ name: "", cin: "", license: "", email: "", phone: "" });
  const [savedClientId, setSavedClientId] = useState<number | null>(null);
  const [vehicles, setVehicles]         = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [startDate, setStartDate]       = useState("");
  const [endDate, setEndDate]           = useState("");
  const [reservation, setReservation]   = useState<any>(null);

  const reset = () => {
    setStep(1); setError(""); setSuccess(""); setScanning(false); setSaving(false);
    setClientData({ name: "", cin: "", license: "", email: "", phone: "" });
    setSavedClientId(null); setVehicles([]); setSelectedVehicle(null);
    setStartDate(""); setEndDate(""); setReservation(null);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true); setError("");
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("type", "cin");

      const res  = await fetch(`${API}/ocr/scan`, { 
        method: "POST", 
        headers: { Accept: "application/json", Authorization: `Bearer ${getToken()}` },
        body: formData
      });
      const data = await res.json();
      if (data.success) { 
        setClientData({ name: data.data.name || "", cin: data.data.id_number || "", license: "", email: "", phone: "" }); 
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
      const res  = await fetch(`${API}/clients`, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify(clientData) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur de création du client.");
      setSavedClientId(data.id);
      const vRes  = await fetch(`${API}/vehicles`, { headers: { Accept: "application/json", Authorization: `Bearer ${getToken()}` } });
      const vData = await vRes.json();
      setVehicles(Array.isArray(vData) ? vData : []);
      setStep(3);
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  const handleReserve = async () => {
    if (!selectedVehicle || !startDate || !endDate || !savedClientId) { setError("Veuillez remplir tous les champs."); return; }
    setSaving(true); setError("");
    try {
      const res  = await fetch(`${API}/reservations`, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify({ client_id: savedClientId, vehicle_id: selectedVehicle.id, start_date: startDate, end_date: endDate }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur de réservation.");
      setReservation(data); setStep(4);
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  const { lang } = useTranslation();

  const handleContract = async () => {
    if (!reservation) return;
    setSaving(true); setError("");
    try {
      await fetch(`${API}/reservations/${reservation.id}/contract?lang=${lang}`, { method: "POST", headers: { Accept: "application/json", Authorization: `Bearer ${getToken()}` } });
      setSuccess("✅ Contrat généré et envoyé !");
    } catch { setError("Erreur lors de la génération du contrat."); }
    finally { setSaving(false); }
  };

  const totalPrice = selectedVehicle && startDate && endDate
    ? (selectedVehicle.dynamic_price || selectedVehicle.price_per_day) * daysBetween(startDate, endDate) : 0;

  return (
    <div className={styles.portal}>
      {/* Stepper */}
      <div className={styles.stepper}>
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.id} className={styles.stepperItem}>
              <div className={`${styles.stepCircle} ${step > s.id ? styles.done : ""} ${step === s.id ? styles.stepActive : ""}`}>
                {step > s.id ? <CheckCircle2 size={16} /> : <Icon size={16} />}
              </div>
              {i < STEPS.length - 1 && <div className={`${styles.stepLine} ${step > s.id ? styles.done : ""}`} />}
            </div>
          );
        })}
      </div>

      {error   && <div className={styles.errorBox}><AlertCircle size={15} /> {error}</div>}
      {success && <div className={styles.successBox}><CheckCircle2 size={15} /> {success}</div>}

      {/* Étape 1 */}
      {step === 1 && (
        <div className={styles.card}>
          <div className={styles.cardHeader}><ScanLine size={20} /><h2>Scanner les Documents</h2></div>
          <p className={styles.hint}>Prenez une photo de la CIN ou du permis du client.</p>
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            ref={fileInputRef} 
            onChange={handleScan} 
            className="hidden" 
            style={{ display: 'none' }}
          />
          <div className={styles.scanTarget} onClick={() => !scanning && fileInputRef.current?.click()}>
            {scanning ? (
              <div className={styles.scannerAnimate}><div className={styles.scannerLine} /><Loader2 size={32} className={styles.spinIcon} /><p>Analyse OCR...</p></div>
            ) : (
              <div className={styles.scanIdle}><Camera size={48} /><p>Appuyer pour prendre une photo</p></div>
            )}
          </div>
          <button className={styles.btnPrimary} onClick={() => !scanning && fileInputRef.current?.click()} disabled={scanning}>
            {scanning ? <><Loader2 size={16} className={styles.spinIcon} /> Traitement IA...</> : <><ScanLine size={16} /> Prendre la photo</>}
          </button>
        </div>
      )}

      {/* Étape 2 */}
      {step === 2 && (
        <div className={styles.card}>
          <div className={styles.cardHeader}><User size={20} /><h2>Informations Client</h2></div>
          <div className={styles.formGrid}>
            {[
              { key: "name",  label: "Nom Complet",  Icon: User,       type: "text",  ph: "Jean Dupont" },
              { key: "cin",   label: "N° CIN",        Icon: CreditCard, type: "text",  ph: "AB123456" },
              { key: "email", label: "Email",          Icon: User,       type: "email", ph: "client@email.com" },
              { key: "phone", label: "Téléphone",      Icon: Phone,      type: "tel",   ph: "0600000000" },
            ].map(({ key, label, Icon, type, ph }) => (
              <div key={key} className={styles.field}>
                <label className={styles.label}><Icon size={13} /> {label}</label>
                <input type={type} value={(clientData as any)[key]} onChange={(e) => setClientData({ ...clientData, [key]: e.target.value })} placeholder={ph} className={styles.input} />
              </div>
            ))}
          </div>
          <div className={styles.btnRow}>
            <button className={styles.btnSecondary} onClick={() => setStep(1)}><ChevronLeft size={16} /> Retour</button>
            <button className={styles.btnPrimary} onClick={handleSaveClient} disabled={saving}>
              {saving ? <><Loader2 size={16} className={styles.spinIcon} /> Enregistrement...</> : <>Confirmer <ChevronRight size={16} /></>}
            </button>
          </div>
        </div>
      )}

      {/* Étape 3 */}
      {step === 3 && (
        <div className={styles.card}>
          <div className={styles.cardHeader}><Car size={20} /><h2>Sélection du Véhicule</h2></div>
          <div className={styles.dateRow}>
            <div className={styles.field}><label className={styles.label}><Calendar size={13} /> Début</label><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={styles.input} /></div>
            <div className={styles.field}><label className={styles.label}><Calendar size={13} /> Fin</label><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={styles.input} /></div>
          </div>
          <div className={styles.vehicleList}>
            {vehicles.map((v) => (
              <div key={v.id} className={`${styles.vehicleCard} ${selectedVehicle?.id === v.id ? styles.selected : ""}`} onClick={() => setSelectedVehicle(v)}>
                <div className={styles.vehicleInfo}><Car size={18} /><div><p className={styles.vehicleName}>{v.brand} {v.model}</p><p className={styles.vehiclePlate}>{v.plate}</p></div></div>
                <div className={styles.vehiclePrice}><span className={styles.dynamicPrice}>{(v.dynamic_price || v.price_per_day)?.toLocaleString("fr-FR")} DH</span><span className={styles.perDay}>/j</span></div>
              </div>
            ))}
          </div>
          {selectedVehicle && startDate && endDate && (
            <div className={styles.totalBox}>
              <span>Total ({daysBetween(startDate, endDate)} jours)</span>
              <strong>{totalPrice.toLocaleString("fr-FR")} DH</strong>
            </div>
          )}
          <div className={styles.btnRow}>
            <button className={styles.btnSecondary} onClick={() => setStep(2)}><ChevronLeft size={16} /> Retour</button>
            <button className={styles.btnPrimary} onClick={handleReserve} disabled={saving || !selectedVehicle}>
              {saving ? <><Loader2 size={16} className={styles.spinIcon} /> Réservation...</> : <>Réserver <ChevronRight size={16} /></>}
            </button>
          </div>
        </div>
      )}

      {/* Étape 4 */}
      {step === 4 && reservation && (
        <div className={styles.card}>
          <div className={styles.cardHeader}><FileCheck size={20} /><h2>Contrat & Confirmation</h2></div>
          <div className={styles.confirmBox}>
            <CheckCircle2 size={48} className={styles.confirmIcon} />
            <h3>Réservation Confirmée !</h3>
            <p>Réf : <strong>#{reservation.id?.toString().padStart(4, "0")}</strong></p>
          </div>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryRow}><span>Client</span><strong>{clientData.name}</strong></div>
            <div className={styles.summaryRow}><span>Véhicule</span><strong>{selectedVehicle?.brand} {selectedVehicle?.model}</strong></div>
            <div className={styles.summaryRow}><span>Période</span><strong>{reservation.start_date} → {reservation.end_date}</strong></div>
            <div className={styles.summaryRow}><span>Total</span><strong className={styles.totalPrice}>{reservation.total_price?.toLocaleString("fr-FR")} DH</strong></div>
          </div>
          <button className={styles.btnPrimary} onClick={handleContract} disabled={saving || !!success}>
            {saving ? <><Loader2 size={16} className={styles.spinIcon} /> Génération...</> : <><FileCheck size={16} /> Générer & Envoyer le Contrat</>}
          </button>
          <button className={styles.btnSecondary} style={{ marginTop: "0.75rem" }} onClick={reset}>Nouvelle Location</button>
        </div>
      )}
    </div>
  );
}
