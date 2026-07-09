"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthGuard } from "@/modules/auth/hooks/useAuthGuard";
import api from "@/shared/services/client";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ChevronLeft, ChevronRight, Filter, X } from "lucide-react";
import AdminPageHeader from "@/modules/admin/components/AdminPageHeader";
import toast from "react-hot-toast";

interface AuditLog {
  id: number;
  created_at: string;
  user?: { id: number; name: string; email: string };
  action: string;
  model: string;
  details: Record<string, unknown> | null;
}

interface Filters {
  date_from: string;
  date_to: string;
  action: string;
  user_id: string;
}

export default function AuditPage() {
  const { user, checking } = useAuthGuard("admin");

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    date_from: "",
    date_to: "",
    action: "",
    user_id: "",
  });

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, per_page: 20 };
      if (filters.date_from) params.date_from = filters.date_from;
      if (filters.date_to) params.date_to = filters.date_to;
      if (filters.action) params.action = filters.action;
      if (filters.user_id) params.user_id = filters.user_id;

      const res = await api.get("/audit-logs", { params });
      const data = res.data;
      setLogs(data.data ?? []);
      setLastPage(data.last_page ?? 1);
      setTotal(data.total ?? 0);
    } catch {
      toast.error("Erreur lors du chargement des logs.");
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    if (!checking && user) fetchLogs();
  }, [fetchLogs, checking, user]);

  const clearFilters = () => {
    setFilters({ date_from: "", date_to: "", action: "", user_id: "" });
    setPage(1);
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDetails = (details: Record<string, unknown> | null) => {
    if (!details) return "—";
    return Object.entries(details)
      .slice(0, 3)
      .map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : v}`)
      .join(", ");
  };

  if (checking) return null;

  return (
    <>
      <AdminPageHeader
        icon={Shield}
        title="Journal d'Audit"
        subtitle="Consultez l'historique des actions effectuées sur le système."
        backLabel="Retour Dashboard"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        {/* Filters Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              showFilters || hasActiveFilters
                ? "bg-primary/10 text-primary"
                : "bg-surface-1 text-slate-600 hover:bg-surface-2"
            }`}
          >
            <Filter size={14} />
            Filtres
            {hasActiveFilters && (
              <span className="ml-1 w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">
                {Object.values(filters).filter(Boolean).length}
              </span>
            )}
          </button>

          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            {total} entrée{total !== 1 ? "s" : ""}
          </p>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-surface-0">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Date début
                  </label>
                  <input
                    type="date"
                    value={filters.date_from}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, date_from: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-surface-1 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Date fin
                  </label>
                  <input
                    type="date"
                    value={filters.date_to}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, date_to: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-surface-1 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Action
                  </label>
                  <select
                    value={filters.action}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, action: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-surface-1 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">Toutes</option>
                    <option value="created">Création</option>
                    <option value="updated">Modification</option>
                    <option value="deleted">Suppression</option>
                    <option value="login">Connexion</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Utilisateur
                  </label>
                  <input
                    type="text"
                    placeholder="ID utilisateur..."
                    value={filters.user_id}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, user_id: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-surface-1 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                {hasActiveFilters && (
                  <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <X size={12} />
                      Effacer les filtres
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-surface-0 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
                Chargement...
              </p>
            </div>
          ) : logs.length === 0 ? (
            <div className="py-16 text-center text-slate-400 italic">
              Aucun log trouvé.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-1 border-b border-slate-200 dark:border-slate-700">
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Modèle
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Détails
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-t border-slate-100 dark:border-slate-800 hover:bg-surface-1 transition-colors"
                    >
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {formatDate(log.created_at)}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                        {log.user?.name ?? "Système"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                            log.action === "created"
                              ? "bg-emerald-100 text-emerald-700"
                              : log.action === "updated"
                              ? "bg-amber-100 text-amber-700"
                              : log.action === "deleted"
                              ? "bg-red-100 text-red-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-mono text-xs">
                        {log.model}
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs max-w-xs truncate">
                        {formatDetails(log.details)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Page {page} / {lastPage}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-xl bg-surface-1 text-slate-600 hover:bg-surface-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                disabled={page === lastPage}
                className="p-2 rounded-xl bg-surface-1 text-slate-600 hover:bg-surface-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}
