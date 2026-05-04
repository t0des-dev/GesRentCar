"use client";

import { useEffect, useState } from "react";
import { Car, Calendar, Search, Filter, ChevronDown, ChevronUp, DollarSign, Loader2, CheckCircle2, User, Hash, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const API = "http://localhost:8000/api";
const getToken = () => typeof window !== "undefined" ? localStorage.getItem("vectoria_token") || "" : "";

const STATUS_MAP: Record<string, { label: string, style: string }> = {
  confirmed: { label: "Confirmée", style: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  pending:   { label: "En attente", style: "bg-amber-50 text-amber-600 border-amber-100" },
  rejected:  { label: "Rejetée", style: "bg-red-50 text-red-600 border-red-100" },
  completed: { label: "Terminée", style: "bg-blue-50 text-blue-600 border-blue-100" },
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
    <div className="space-y-12">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-slate-100 pb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2 flex items-center gap-3">
            <Calendar className="text-primary" />
            Historique des Locations
          </h2>
          <p className="text-slate-400 font-medium text-sm italic">Gestion centralisée des contrats et encaissements.</p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96 group">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Rechercher client, véhicule, réf..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 pl-14 pr-6 py-4 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
          />
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="bg-white border border-slate-100 rounded-2xl px-4 py-1 flex items-center gap-2">
            <Filter size={14} className="text-slate-300" />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none text-xs font-black uppercase tracking-widest text-slate-500 focus:ring-0 cursor-pointer py-3"
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
      <div className="space-y-4">
        {loading ? (
          <div className="p-20 text-center uppercase text-[10px] font-black tracking-[0.3em] text-slate-300 animate-pulse">
            Synchronisation des données...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-20 text-center border-2 border-dashed border-slate-100 rounded-[48px] space-y-4">
            <Search size={48} className="text-slate-100 mx-auto" />
            <p className="text-slate-300 italic text-sm">Aucun résultat ne correspond à votre recherche.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((r) => (
              <motion.div
                layout
                key={r.id}
                className={cn(
                  "bg-white rounded-[32px] border transition-all duration-500 overflow-hidden",
                  expanded === r.id ? "border-primary shadow-xl shadow-primary/5" : "border-slate-50 shadow-sm hover:border-slate-200"
                )}
              >
                {/* Main Row */}
                <div 
                  onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                  className="p-6 flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-8">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-xs text-slate-400 border border-slate-100 group-hover:bg-primary group-hover:text-white transition-colors">
                      #{r.id?.toString().padStart(4, "0")}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-sm group-hover:text-primary transition-colors">
                        {r.vehicle ? `${r.vehicle.brand} ${r.vehicle.model}` : "Premium Vehicle"}
                      </h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mt-1">
                        <User size={10} className="text-primary" />
                        {r.client?.name ?? "Client Inconnu"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-10">
                    <div className={cn(
                      "hidden md:flex px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                      STATUS_MAP[r.status]?.style || "bg-slate-50 text-slate-400 border-slate-100"
                    )}>
                      {STATUS_MAP[r.status]?.label || r.status}
                    </div>
                    
                    <div className="text-right w-32">
                      <p className="font-black text-slate-900 text-lg">
                        {parseFloat(r.total_price).toLocaleString("fr-FR")} DH
                      </p>
                    </div>
                    
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                      expanded === r.id ? "bg-primary text-white" : "bg-slate-50 text-slate-300"
                    )}>
                      {expanded === r.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
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
                      <div className="p-8 bg-slate-50/30 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                          {[
                            { label: "Prise en charge", value: r.start_date, icon: Calendar },
                            { label: "Restitution", value: r.end_date, icon: Calendar },
                            { label: "Immatriculation", value: r.vehicle?.plate ?? "—", icon: Tag },
                            { label: "Total Contrat", value: `${parseFloat(r.total_price).toLocaleString("fr-FR")} DH`, icon: Hash, premium: true },
                          ].map((item, i) => (
                            <div key={i} className="space-y-1">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <item.icon size={10} className="text-primary" />
                                {item.label}
                              </p>
                              <p className={cn("font-bold text-sm", item.premium ? "text-primary font-black" : "text-slate-900")}>
                                {item.value}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Payment Actions */}
                        {r.status !== 'completed' && r.status !== 'rejected' && (
                          <div className="bg-white p-6 rounded-[24px] border border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                                <DollarSign size={18} />
                              </div>
                              <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Encaisser un paiement</p>
                            </div>
                            
                            <div className="flex w-full sm:w-auto gap-3">
                              <input
                                type="number"
                                placeholder="Montant DH"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                                className="w-full sm:w-40 bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all"
                              />
                              <button
                                onClick={() => handlePayment(r.id)}
                                disabled={paying === r.id || !paymentAmount}
                                className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 shadow-lg hover:shadow-emerald-500/20 transition-all disabled:opacity-30 flex items-center gap-2"
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
