"use client";

import { useEffect, useState } from "react";
import { Car, Calendar, Search, Filter, ChevronDown, ChevronUp, DollarSign, Loader2, CheckCircle } from "lucide-react";
import styles from "../sections.module.css";

const API = "http://localhost:8000/api";
const getToken = () => typeof window !== "undefined" ? localStorage.getItem("vectoria_token") || "" : "";

const STATUS_COLORS: Record<string, string> = {
  confirmed: "s_confirmed",
  pending:   "s_pending",
  rejected:  "s_rejected",
  completed: "s_completed",
};

export default function MyReservations() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paying, setPaying] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/reservations`, {
        headers: { Accept: "application/json", Authorization: `Bearer ${getToken()}` },
      });
      const d = await r.json();
      const list = Array.isArray(d) ? d : d.data ?? [];
      setReservations(list);
      setFiltered(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handlePayment = async (reservationId: number) => {
    if (!paymentAmount || isNaN(Number(paymentAmount))) return;
    setPaying(reservationId);
    try {
      const res = await fetch(`${API}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          reservation_id: reservationId,
          amount: Number(paymentAmount),
        }),
      });
      if (res.ok) {
        setPaymentAmount("");
        fetchData(); // Refresh list
      }
    } catch { /* ignore */ } finally {
      setPaying(null);
    }
  };

  useEffect(() => {
    let list = reservations;
    if (statusFilter !== "all") list = list.filter((r) => r.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((r) =>
        r.client?.name?.toLowerCase().includes(q) ||
        r.vehicle?.brand?.toLowerCase().includes(q) ||
        String(r.id).includes(q)
      );
    }
    setFiltered(list);
  }, [search, statusFilter, reservations]);

  return (
    <div>
      <h2 className={styles.sectionTitle}><Calendar size={18} /> Mes Locations</h2>

      {/* Filtres */}
      <div className={styles.filterRow}>
        <div className={styles.searchBox}>
          <Search size={15} />
          <input
            type="text"
            placeholder="Rechercher client, véhicule..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filterSelect}>
          <Filter size={14} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={styles.select}>
            <option value="all">Tous les statuts</option>
            <option value="confirmed">Confirmées</option>
            <option value="pending">En attente</option>
            <option value="completed">Terminées</option>
            <option value="rejected">Rejetées</option>
          </select>
        </div>
      </div>

      {/* Liste */}
      {loading ? (
        <div className={styles.skeleton} />
      ) : filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <Calendar size={40} />
          <p>Aucune réservation trouvée.</p>
        </div>
      ) : (
        <div className={styles.resList}>
          {filtered.map((r) => (
            <div key={r.id} className={styles.resCard}>
              {/* Header ligne */}
              <div className={styles.resRow} onClick={() => setExpanded(expanded === r.id ? null : r.id)}>
                <span className={styles.resId}>#{r.id?.toString().padStart(4, "0")}</span>
                <div className={styles.resInfo}>
                  <p className={styles.resVehicle}>{r.vehicle ? `${r.vehicle.brand} ${r.vehicle.model}` : "—"}</p>
                  <p className={styles.resClient}>{r.client?.name ?? "—"}</p>
                </div>
                <span className={`${styles.badge} ${styles[STATUS_COLORS[r.status] ?? ""]}`}>{r.status}</span>
                <strong className={styles.resPrice}>{r.total_price?.toLocaleString("fr-FR")} DH</strong>
                {expanded === r.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>

              {/* Détail dépliable */}
              {expanded === r.id && (
                <div className={styles.resDetail}>
                  <div className={styles.detailGrid}>
                    <div><span>Début</span><strong>{r.start_date}</strong></div>
                    <div><span>Fin</span><strong>{r.end_date}</strong></div>
                    <div><span>Plaque</span><strong>{r.vehicle?.plate ?? "—"}</strong></div>
                    <div><span>Montant</span><strong className={styles.green}>{r.total_price?.toLocaleString("fr-FR")} DH</strong></div>
                  </div>

                  {/* Bloc Paiement */}
                  {r.status !== 'completed' && r.status !== 'rejected' && (
                    <div className={styles.paymentActions}>
                      <div className={styles.paymentInputGroup}>
                        <DollarSign size={14} className={styles.payIcon} />
                        <input
                          type="number"
                          placeholder="Montant à encaisser"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          className={styles.payInput}
                        />
                        <button
                          className={styles.btnPay}
                          onClick={() => handlePayment(r.id)}
                          disabled={paying === r.id || !paymentAmount}
                        >
                          {paying === r.id ? <Loader2 size={14} className={styles.spinIcon} /> : <CheckCircle size={14} />}
                          Encaisser
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
