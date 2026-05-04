"use client";

import { Users, Fuel, Settings, ShieldCheck } from "lucide-react";
import styles from "../../../app/search/[id]/page.module.css";

interface VehicleInfoProps {
  vehicle: any;
  image: string;
}

export default function VehicleInfo({ vehicle, image }: VehicleInfoProps) {
  return (
    <div className={styles.mainInfo}>
      <div className={styles.gallery}>
        <img src={image} alt={vehicle.model} className={styles.mainImg} />
      </div>

      <div className={styles.specs}>
        <div className={styles.specItem}><Users size={20} /><span>{vehicle.seats || 5} Places</span></div>
        <div className={styles.specItem}><Fuel size={20} /><span>{vehicle.fuel_type || "Diesel / Hybride"}</span></div>
        <div className={styles.specItem}><Settings size={20} /><span>{vehicle.transmission || "Automatique"}</span></div>
        <div className={styles.specItem}><ShieldCheck size={20} /><span>Assurance Premium</span></div>
      </div>

      <div className={styles.description}>
        <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase tracking-widest">L'Expérience {vehicle.brand}</h2>
        <p className="text-slate-500 leading-relaxed italic">
          La {vehicle.brand} {vehicle.model} redéfinit les standards de l'excellence automobile. 
          Chaque courbe de sa carrosserie et chaque détail de son habitacle ont été conçus pour offrir 
          une expérience de conduite immersive et luxueuse. Profitez d'un confort souverain pour vos longs trajets au Maroc.
        </p>
      </div>
    </div>
  );
}
