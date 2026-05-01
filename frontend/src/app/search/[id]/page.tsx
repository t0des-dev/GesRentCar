"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ChevronLeft, Calendar, Users, Fuel, 
  Settings, ShieldCheck, Star, Loader2,
  CheckCircle2
} from "lucide-react";
import styles from "./page.module.css";

const API = "http://localhost:8000/api";

const IMAGE_MAPPING: Record<string, string> = {
  "mercedes": "/mercedes_c_class_white_1777383858811.png",
  "bmw": "/bmw_x5_black_1777383873396.png",
  "range rover": "/range_rover_grey_1777383961416.png",
};

export default function VehicleDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [success, setSuccess] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  // Form State
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    cin: "",
    start_date: "",
    end_date: "",
  });

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetch(`${API}/vehicles/${id}`)
      .then(r => r.json())
      .then(d => {
        setVehicle(d);
        setTotalPrice(d.price_per_day);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (form.start_date && form.end_date && vehicle) {
      const start = new Date(form.start_date);
      const end = new Date(form.end_date);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      setTotalPrice(diffDays * vehicle.price_per_day);
    }
  }, [form.start_date, form.end_date, vehicle]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBooking(true);
    try {
      // 1. Créer/Vérifier le client
      const clientRes = await fetch(`${API}/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, cin: form.cin })
      });
      const clientData = await clientRes.json();
      const clientId = clientData.id;

      // 2. Créer la réservation
      const res = await fetch(`${API}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          client_id: clientId,
          vehicle_id: id,
          start_date: form.start_date,
          end_date: form.end_date
        })
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/"), 3000);
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Erreur lors de la réservation");
      }
    } catch (err) {
      alert("Une erreur est survenue.");
    } finally {
      setBooking(false);
    }
  };

  if (loading) return (
    <div className={styles.loading}>
      <Loader2 className={styles.spin} />
      <p>Chargement du véhicule...</p>
    </div>
  );

  if (!vehicle) return <div className="container">Véhicule introuvable.</div>;

  const vehicleImage = IMAGE_MAPPING[vehicle.brand.toLowerCase()] || "/car-placeholder.png";

  return (
    <div className={styles.container}>
      <button onClick={() => router.back()} className={styles.backBtn}>
        <ChevronLeft size={20} />
        Retour à la recherche
      </button>

      <div className={styles.layout}>
        {/* Left: Gallery & Info */}
        <div className={styles.mainInfo}>
          <div className={styles.gallery}>
            <img src={vehicleImage} alt={vehicle.model} className={styles.mainImg} />
          </div>

          <div className={styles.specs}>
            <div className={styles.specItem}>
              <Users size={20} />
              <span>5 Places</span>
            </div>
            <div className={styles.specItem}>
              <Fuel size={20} />
              <span>Diesel / Hybride</span>
            </div>
            <div className={styles.specItem}>
              <Settings size={20} />
              <span>Automatique</span>
            </div>
            <div className={styles.specItem}>
              <ShieldCheck size={20} />
              <span>Assurance Premium</span>
            </div>
          </div>

          <div className={styles.description}>
            <h2>À propos de ce véhicule</h2>
            <p>
              La {vehicle.brand} {vehicle.model} allie performance et élégance. 
              Parfaite pour vos déplacements professionnels ou vos escapades en famille, 
              ce véhicule offre un confort inégalé et une sécurité de premier ordre.
            </p>
          </div>
        </div>

        {/* Right: Booking Card */}
        <aside className={styles.bookingCard}>
          {success ? (
            <div className={styles.successMsg}>
              <CheckCircle2 size={60} color="#10b981" />
              <h3>Réservation Envoyée !</h3>
              <p>Votre demande est en cours de traitement. Vous recevrez un SMS de confirmation sous peu.</p>
              <button onClick={() => router.push("/")} className={styles.btnHome}>Retour à l'accueil</button>
            </div>
          ) : (
            <>
              <div className={styles.priceHeader}>
                <span className={styles.price}>{totalPrice.toLocaleString("fr-FR")} DH</span>
                <span className={styles.unit}>{form.start_date && form.end_date ? "Total" : "/ jour"}</span>
              </div>

              <form onSubmit={handleBooking} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label>Nom Complet</label>
                  <input 
                    type="text" required placeholder="Ex: Jean Dupont"
                    value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Email</label>
                  <input 
                    type="email" required placeholder="jean@example.com"
                    value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Téléphone (SMS)</label>
                  <input 
                    type="tel" required placeholder="06XXXXXXXX"
                    value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>N° CIN / Passeport</label>
                  <input 
                    type="text" required placeholder="AB123456"
                    value={form.cin} onChange={e => setForm({...form, cin: e.target.value})}
                  />
                </div>

                <div className={styles.dateGrid}>
                  <div className={styles.inputGroup}>
                    <label>Départ</label>
                    <input 
                      type="date" required min={today}
                      value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Retour</label>
                    <input 
                      type="date" required min={form.start_date || today}
                      value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})}
                    />
                  </div>
                </div>

                {form.start_date && form.end_date && (
                  <div className={styles.priceSummary}>
                    <span>{vehicle.price_per_day} DH x {Math.ceil(Math.abs(new Date(form.end_date).getTime() - new Date(form.start_date).getTime()) / (1000 * 60 * 60 * 24)) || 1} jours</span>
                    <strong>{totalPrice.toLocaleString("fr-FR")} DH</strong>
                  </div>
                )}

                <button type="submit" className={styles.btnSubmit} disabled={booking}>
                  {booking ? <Loader2 className={styles.spin} size={20} /> : "Confirmer ma Réservation"}
                </button>
              </form>

              <div className={styles.guarantees}>
                <div className={styles.guarantee}><CheckCircle2 size={14} /> Annulation gratuite (24h)</div>
                <div className={styles.guarantee}><CheckCircle2 size={14} /> Kilométrage illimité</div>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
