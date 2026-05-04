"use client";

import { Search, Plus } from "lucide-react";
import styles from "@/app/admin/fleet/page.module.css";

interface FleetToolbarProps {
  search: string;
  setSearch: (val: string) => void;
  onAdd: () => void;
  count: number;
}

export default function FleetToolbar({ search, setSearch, onAdd, count }: FleetToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.searchWrap}>
        <Search size={22} strokeWidth={1.5} />
        <input 
          type="text" 
          placeholder="Rechercher par excellence, modèle ou plaque..." 
          value={search} 
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className={styles.stats}>
        <strong>{count}</strong> modèles en inventaire
      </div>
    </div>
  );
}
