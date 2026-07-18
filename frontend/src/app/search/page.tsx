"use client";

import { useTranslation } from "@/shared/hooks/useTranslation";
import { useState, useEffect } from "react";
import { Search, Calendar, Filter, Loader2, AlertCircle, Car } from "lucide-react";
import { useRouter } from "next/navigation";
import VehicleCard from "@/modules/fleet/components/VehicleCard";
import { notifyError } from "@/components/Notifications";
import styles from "./page.module.css";

import { API_URL as API } from "@/lib/api/config";

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'eco', label: 'Economy' },
  { id: 'standard', label: 'Standard' },
  { id: 'suv', label: 'SUV' },
  { id: 'luxury', label: 'Luxury' },
  { id: 'sport', label: 'Sport' },
];

// Mapping des images générées pour la démo
const IMAGE_MAPPING: Record<string, string> = {
  "mercedes": "/mercedes_c_class_white_1777383858811.png",
  "bmw": "/bmw_x5_black_1777383873396.png",
  "range rover": "/range_rover_grey_1777383961416.png",
};

export default function SearchPage() {
  const { t, lang } = useTranslation();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const fetchVehicles = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.set('category', selectedCategory);
      if (startDate) params.set('start_date', startDate);
      if (endDate) params.set('end_date', endDate);
      const qs = params.toString();
      const query = qs ? `?${qs}` : '';
      const res = await fetch(`${API}/vehicles${query}`);
      const data = await res.json();
      
      const list = Array.isArray(data) ? data : data.data ?? [];
      
      // Injecter les images pour la démo visuelle
      const enriched = list.map((v: any) => ({
        ...v,
        image: IMAGE_MAPPING[v.brand.toLowerCase()] || "/car-placeholder.png"
      }));
      
      setVehicles(enriched);
    } catch {
      setError("Impossible de charger les véhicules. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchVehicles(); }, [selectedCategory]);

  const handleReserve = (vehicleId: number) => {
    const searchParams = new URLSearchParams();
    searchParams.set('vehicle', String(vehicleId));
    if (startDate) searchParams.set('start_date', startDate);
    if (endDate) searchParams.set('end_date', endDate);
    router.push(`/booking?${searchParams.toString()}`);
  };

  const handleSearch = () => {
    if (!startDate || !endDate) {
      notifyError("Veuillez selectionner les dates de debut et de fin.");
      return;
    }
    localStorage.setItem('vrc_search_start', startDate);
    localStorage.setItem('vrc_search_end', endDate);
    fetchVehicles();
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <header className={styles.header}>
        <h1 className={styles.title}>Trouvez votre véhicule idéal</h1>
        <p className={styles.subtitle}>Explorez notre flotte premium et réservez en quelques clics.</p>
        
        <div className={styles.searchBar}>
          <div className={styles.inputGroup}>
            <Calendar size={18} className={styles.icon} />
            <div className={styles.inputWrap}>
              <label>Date de départ</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
          </div>
          
          <div className={styles.divider} />
          
          <div className={styles.inputGroup}>
            <Calendar size={18} className={styles.icon} />
            <div className={styles.inputWrap}>
              <label>Date de retour</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
          
          <button className={styles.btnSearch} onClick={handleSearch}>
            <Search size={20} />
            Rechercher
          </button>
        </div>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.categoryFilters}>
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id} 
              className={`${styles.catBtn} ${selectedCategory === cat.id ? styles.catBtnActive : ""}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.id === 'all' ? t('all_categories') : (t(cat.id) || cat.label)}
            </button>
          ))}
        </div>
        
        <div className={styles.resultsCount}>
          {loading ? t('searching') : (
            <>
              <strong>{vehicles.length}</strong> {t('vehicles_available')}
            </>
          )}
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingState}>
          <Loader2 size={40} className={styles.spin} />
          <p>Chargement de la flotte Vectoria...</p>
        </div>
      ) : error ? (
        <div className={styles.errorState}>
          <AlertCircle size={40} />
          <p>{error}</p>
          <button onClick={fetchVehicles} className="btn btn-secondary">Réessayer</button>
        </div>
      ) : vehicles.length === 0 ? (
        <div className={styles.emptyState}>
          <Car size={60} />
          <h3>Aucun véhicule disponible</h3>
          <p>Essayez de modifier vos dates ou filtres.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              id={vehicle.id}
              brand={vehicle.brand}
              model={vehicle.model}
              type={vehicle.type ?? vehicle.category ?? 'Standard'}
              price={vehicle.price_per_day ?? vehicle.price ?? 0}
              seats={vehicle.seats ?? 5}
              fuel={vehicle.fuel ?? 'N/A'}
              transmission={vehicle.transmission ?? 'Automatique'}
              imageUrl={vehicle.image ?? vehicle.image_url ?? undefined}
              onReserve={handleReserve}
            />
          ))}
        </div>
      )}
    </div>
  );
}
