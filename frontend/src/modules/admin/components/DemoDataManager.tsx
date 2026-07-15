"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car, Users, CalendarCheck, CreditCard, Wrench, Receipt, FileText, ClipboardList,
  Play, Trash2, AlertTriangle, CheckCircle, Loader2, RefreshCw, Database, Info,
  Star, Tag, Award, Activity
} from "lucide-react";
import api from "@/shared/services/client";

const DEMO_TYPES = [
  { id: "vehicles", label: "Véhicules (10)", icon: Car },
  { id: "clients", label: "Clients (8)", icon: Users },
  { id: "reservations", label: "Réservations (8)", icon: CalendarCheck },
  { id: "payments", label: "Paiements", icon: CreditCard },
  { id: "maintenances", label: "Maintenances (4)", icon: Wrench },
  { id: "invoices", label: "Factures (3)", icon: FileText },
  { id: "expenses", label: "Dépenses (4)", icon: Receipt },
  { id: "reviews", label: "Reviews (5)", icon: Star },
  { id: "promo_codes", label: "Promo Codes (2)", icon: Tag },
  { id: "loyalty", label: "Loyalty", icon: Award },
  { id: "activity_logs", label: "Activity Logs", icon: Activity },
];

interface DemoStats {
  vehicles: number;
  clients: number;
  reservations: number;
  payments: number;
  maintenances: number;
  expenses: number;
  invoices: number;
  contracts: number;
  reviews: number;
  promo_codes: number;
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}

function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-2xl font-black text-slate-900">{value.toLocaleString()}</p>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
      </div>
    </motion.div>
  );
}

export default function DemoDataManager() {
  const [stats, setStats] = useState<DemoStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<"populate" | "clear" | null>(null);
  const [confirmAction, setConfirmAction] = useState<"populate" | "clear" | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(DEMO_TYPES.map(t => t.id));

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  const toggleType = (id: string) => {
    setSelectedTypes(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/demo/stats");
      setStats(res.data);
    } catch {
      setStats({ vehicles: 0, clients: 0, reservations: 0, payments: 0, maintenances: 0, expenses: 0, invoices: 0, contracts: 0, reviews: 0, promo_codes: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const handleAction = async (action: "populate" | "clear") => {
    setConfirmAction(null);
    setActionLoading(action);
    try {
      let res;
      if (action === "populate") {
        const allSelected = selectedTypes.length === DEMO_TYPES.length;
        const body = allSelected ? {} : { types: selectedTypes };
        res = await api.post(`/admin/demo/${action}`, body);
      } else {
        res = await api.post(`/admin/demo/${action}`);
      }
      showToast("success", res.data?.message || (action === "populate" ? "Données de démo initialisées !" : "Données de démo supprimées !"));
      await fetchStats();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToast("error", msg || "Une erreur est survenue.");
    } finally {
      setActionLoading(null);
    }
  };

  const statCards = stats ? [
    { icon: Car, label: "Véhicules", value: stats.vehicles, color: "bg-blue-50 text-blue-600" },
    { icon: Users, label: "Clients", value: stats.clients, color: "bg-purple-50 text-purple-600" },
    { icon: CalendarCheck, label: "Réservations", value: stats.reservations, color: "bg-amber-50 text-amber-600" },
    { icon: CreditCard, label: "Paiements", value: stats.payments, color: "bg-green-50 text-green-600" },
    { icon: Wrench, label: "Maintenances", value: stats.maintenances, color: "bg-orange-50 text-orange-600" },
    { icon: Receipt, label: "Dépenses", value: stats.expenses, color: "bg-red-50 text-red-600" },
    { icon: FileText, label: "Factures", value: stats.invoices, color: "bg-teal-50 text-teal-600" },
    { icon: ClipboardList, label: "Contrats", value: stats.contracts, color: "bg-indigo-50 text-indigo-600" },
    { icon: Star, label: "Reviews", value: stats.reviews, color: "bg-yellow-50 text-yellow-600" },
    { icon: Tag, label: "Promo Codes", value: stats.promo_codes, color: "bg-pink-50 text-pink-600" },
  ] : [];

  return (
    <div className="space-y-8">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border ${
              toast.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {toast.type === "success" ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
            <span className="text-sm font-semibold">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Banner */}
      <div className="flex items-start gap-4 bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <Info size={20} className="text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-blue-800 mb-1">À propos des données de démo</p>
          <p className="text-xs text-blue-700 leading-relaxed">
            Ce module vous permet d&apos;initialiser votre base de données avec des véhicules, clients, réservations, paiements, reviews, promo codes et données de fidélité de test réalistes — idéal pour démontrer la plateforme à des clients ou tester de nouvelles fonctionnalités. Sélectionnez les types de données à créer ou supprimez tout en un clic.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-slate-900">État de la Base de Données</h2>
          <button
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-primary transition-colors"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Actualiser
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {statCards.map((card, i) => (
              <motion.div key={card.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <StatCard {...card} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Populate Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white border border-slate-200 rounded-3xl p-7 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600">
              <Database size={26} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-lg">Remplir la Flotte</h3>
              <p className="text-xs text-slate-500 font-medium">Données de démo</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            Sélectionnez les types de données à initialiser dans votre base. Vous pouvez tout sélectionner ou choisir uniquement les catégories souhaitées.
          </p>

          {/* Checkbox Group */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {DEMO_TYPES.map(type => (
              <label
                key={type.id}
                className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer hover:bg-slate-50 rounded-lg p-2 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type.id)}
                  onChange={() => toggleType(type.id)}
                  className="w-4 h-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
                />
                <type.icon size={14} className="text-slate-500" />
                <span>{type.label}</span>
              </label>
            ))}
          </div>

          <ul className="space-y-2 mb-6">
            {["Mercedes-Benz G63 AMG, Porsche 911, Land Rover Range Rover...", "8 clients de test", "8 réservations actives, confirmées et complétées", "Paiements, factures et maintenances", "5 reviews clients, 2 promo codes", "Données de fidélité et logs d'activité"].map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-slate-600">
                <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>

          {confirmAction === "populate" ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 space-y-3">
              <p className="text-sm font-bold text-green-800">Confirmer l&apos;initialisation ?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleAction("populate")}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2.5 rounded-xl transition-colors"
                >
                  Oui, initialiser
                </button>
                <button
                  onClick={() => setConfirmAction(null)}
                  className="flex-1 bg-white border border-slate-200 text-slate-600 text-sm font-bold py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setConfirmAction("populate")}
              disabled={actionLoading !== null || selectedTypes.length === 0}
              className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl transition-all shadow-sm hover:shadow-md"
            >
              {actionLoading === "populate" ? (
                <><Loader2 size={18} className="animate-spin" /> Initialisation en cours...</>
              ) : (
                <><Play size={18} /> Remplir la Flotte (Démo)</>
              )}
            </button>
          )}
        </motion.div>

        {/* Clear Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white border border-slate-200 rounded-3xl p-7 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500">
              <Trash2 size={26} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-lg">Vider les Données</h3>
              <p className="text-xs text-slate-500 font-medium">Action irréversible</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            Supprime <strong>toutes les réservations</strong>, paiements, contrats, maintenances, dépenses, véhicules, clients, reviews, promo codes et données de fidélité de la base de données.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-800 mb-1">Attention — Action irréversible</p>
                <p className="text-xs text-amber-700">Cette action supprime définitivement toutes les données. Les comptes admin et agent sont conservés.</p>
              </div>
            </div>
          </div>

          {confirmAction === "clear" ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-3">
              <p className="text-sm font-bold text-red-800">Êtes-vous sûr de vouloir tout supprimer ?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleAction("clear")}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2.5 rounded-xl transition-colors"
                >
                  Oui, tout supprimer
                </button>
                <button
                  onClick={() => setConfirmAction(null)}
                  className="flex-1 bg-white border border-slate-200 text-slate-600 text-sm font-bold py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setConfirmAction("clear")}
              disabled={actionLoading !== null}
              className="w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl transition-all shadow-sm hover:shadow-md"
            >
              {actionLoading === "clear" ? (
                <><Loader2 size={18} className="animate-spin" /> Suppression en cours...</>
              ) : (
                <><Trash2 size={18} /> Vider les Données Démo</>
              )}
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
