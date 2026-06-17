"use client";

import { useEffect, useState } from "react";
import { Car, Calendar, Search, Filter, ChevronDown, ChevronUp, DollarSign, Loader2, CheckCircle2, User, Hash, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/utils";

const API = "http://localhost:8000/api/v1";
const getToken = () => typeof window !== "undefined" ? localStorage.getItem("vectoria_token") || "" : "";

const STATUS_MAP: Record<string, { label: string, style: string }> = {
  confirmed: { label: "Confirmée", style: "badge-success" },
  pending:   { label: "En attente", style: "badge-warning" },
  rejected:  { label: "Rejetée", style: "badge-destructive" },
  completed: { label: "Terminée", style: "badge-primary" },
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1 flex items-center gap-2">
            <Calendar className="text-primary" size={22} />
            Historique des Locations
          </h2>
          <p className="text-slate-400 text-sm">Gestion centralisée des contrats et encaissements.</p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            type="text"
            placeholder="Rechercher client, véhicule, réf..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-premium w-full pl-10 pr-4 py-3"
          />
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="bg-white border border-slate-100 rounded-xl px-3 py-1 flex items-center gap-2">
            <Filter size={14} className="text-slate-300" />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none text-xs font-semibold uppercase tracking-widest text-slate-500 focus:ring-0 cursor-pointer py-2"
            >
              <option value="all">Tous les Statuts</option>
              <option value="confirmed">Confirmées</option>
              <option value="pending">En attente</option>
              <option value="completed">Terminées</option>
              <option value="rejected">Rejetées</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-16 text-center uppercase text-[10px] font-semibold tracking-widest text-slate-300 animate-pulse">
            Synchronisation des données...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center border-2 border-dashed border-slate-100 rounded-2xl space-y-3">
            <Search size={40} className="text-slate-100 mx-auto" />
            <p className="text-slate-300 italic text-sm">Aucun résultat ne correspond à votre recherche.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((r) => (
              <motion.div
                layout
                key={r.id}
                className={cn(
                  "bg-white rounded-2xl border transition-all duration-300 overflow-hidden",
                  expanded === r.id ? "border-primary shadow-sm" : "border-slate-100 hover:border-slate-200"
                )}
              >
                {/* Main Row */}
                <div 
                  onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                  className="p-5 flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center font-semibold text-xs text-slate-400 border border-slate-100 group-hover:bg-primary group-hover:text-white transition-colors">
                      #{r.id?.toString().padStart(4, "0")}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">
                        {r.vehicle ? `${r.vehicle.brand} ${r.vehicle.model}` : "Premium Vehicle"}
                      </h4>
                      <p className="text-[10px] font-medium text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <User size={10} className="text-primary" />
                        {r.client?.name ?? "Client Inconnu"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-semibold uppercase tracking-widest",
                      STATUS_MAP[r.status]?.style || "badge-neutral"
                    )}>
                      {STATUS_MAP[r.status]?.label || r.status}
                    </div>
                    
                    <div className="text-right w-28">
                      <p className="font-bold text-slate-900">
                        {parseFloat(r.total_price).toLocaleString("fr-FR")} DH
                      </p>
                    </div>
                    
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                      expanded === r.id ? "bg-primary text-white" : "bg-slate-50 text-slate-300"
                    )}>
                      {expanded === r.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <AnimatePresence>
                  {expanded === r.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-50"
                    >
                      <div className="p-6 bg-slate-50/30 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                          {[
                            { label: "Prise en charge", value: r.start_date, icon: Calendar },
                            { label: "Restitution", value: r.end_date, icon: Calendar },
                            { label: "Immatriculation", value: r.vehicle?.plate ?? "—", icon: Tag },
                            { label: "Total Contrat", value: `${parseFloat(r.total_price).toLocaleString("fr-FR")} DH`, icon: Hash, premium: true },
                          ].map((item, i) => (
                            <div key={i}>
                              <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                                <item.icon size={10} className="text-primary" />
                                {item.label}
                              </p>
                              <p className={cn("font-semibold text-sm", item.premium ? "text-primary" : "text-slate-900")}>
                                {item.value}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Payment Actions */}
                        {r.status !== 'completed' && r.status !== 'rejected' && (
                          <div className="bg-white p-5 rounded-2xl border border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                                <DollarSign size={16} />
                              </div>
                              <p className="text-[10px] font-semibold text-slate-900 uppercase tracking-widest">Encaisser un paiement</p>
                            </div>
                            
                            <div className="flex w-full sm:w-auto gap-2">
                              <input
                                type="number"
                                placeholder="Montant DH"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                                className="input-premium w-full sm:w-36 px-4 py-2.5 text-sm"
                              />
                              <button
                                onClick={() => handlePayment(r.id)}
                                disabled={paying === r.id || !paymentAmount}
                                className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-semibold uppercase tracking-widest hover:bg-emerald-600 transition-all disabled:opacity-30 flex items-center gap-2"
                              >
                                {paying === r.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                                Encaisser
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
