"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuthGuard } from "@/modules/auth/hooks/useAuthGuard";
import { Plus, Search, Filter, Trash2, FileText, Wallet, TrendingUp, AlertTriangle } from "lucide-react";
import api from "@/shared/services/client";
import { getImageUrl } from "@/shared/utils/image";
import { motion, AnimatePresence } from "framer-motion";
import { Expense } from "@/types/admin";
import ExpenseFormDrawer from "@/modules/admin/components/expenses/ExpenseFormDrawer";
import ExpensesChart from "@/modules/admin/components/expenses/ExpensesChart";
import { ConfirmDialog } from "@/components/Notifications";
import { toast } from "react-hot-toast";
import { fmt } from "@/shared/utils/format";

export default function ExpensesPage() {
  const { user, checking } = useAuthGuard("admin");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<() => void>(() => {});

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const [year, month] = monthFilter.split("-");
      const res = await api.get('/expenses', {
        params: {
          year,
          month,
          category: categoryFilter !== 'all' ? categoryFilter : undefined
        }
      });
      const raw = res.data;
      setExpenses(Array.isArray(raw) ? raw : raw?.data ?? []);
    } catch {
      toast.error("Erreur de synchronisation des depenses.");
    } finally {
      setLoading(false);
    }
  }, [monthFilter, categoryFilter]);

  useEffect(() => {
    if (!checking && user) fetchExpenses(); // eslint-disable-line react-hooks/set-state-in-effect
  }, [fetchExpenses, checking, user]);

  const handleDelete = async (id: number) => {
    setPendingAction(() => async () => {
      try {
        await api.delete(`/expenses/${id}`);
        toast.success("Depense supprimee.");
        fetchExpenses();
      } catch {
        toast.error("Erreur lors de la suppression.");
      }
    });
    setConfirmOpen(true);
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      (e.vehicle && (`${e.vehicle.brand} ${e.vehicle.model}`).toLowerCase().includes(search.toLowerCase())) ||
      (e.notes && e.notes.toLowerCase().includes(search.toLowerCase()))
    );
  }, [expenses, search]);

  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  }, [filteredExpenses]);

  const highestExpense = useMemo(() => {
    if (filteredExpenses.length === 0) return null;
    return filteredExpenses.reduce((max, exp) => Number(exp.amount) > Number(max.amount) ? exp : max, filteredExpenses[0]);
  }, [filteredExpenses]);

  const categoriesCount = useMemo(() => {
    return new Set(filteredExpenses.map(e => e.category)).size;
  }, [filteredExpenses]);

  if (checking) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Verification de la session...</p>
    </div>
  );

  return (
    <>
      {/* ── Header ── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
              <Wallet size={20} className="text-primary" strokeWidth={2} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Tresorerie</h1>
          </div>
          <p className="text-slate-500 text-lg font-light">Suivez, analysez et gerez toutes les depenses de votre flotte.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setCurrentExpense(null); setShowDrawer(true); }}
          className="btn-primary"
        >
          <Plus size={16} /> Nouvelle Depense
        </motion.button>
      </motion.header>

      {/* ── KPIs & Chart ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* KPI 1 — Total */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card-premium bg-gradient-to-br from-slate-900 to-slate-800 text-white p-7 flex flex-col justify-between"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <TrendingUp size={18} className="text-primary" />
            </div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total depenses</h3>
          </div>
          <div>
            <p className="text-4xl font-black tracking-tight">{fmt(totalAmount)} <span className="text-lg font-bold text-slate-500">DH</span></p>
            <p className="text-xs text-slate-400 mt-3">Periode selectionnee &middot; {filteredExpenses.length} depenses</p>
          </div>
        </motion.div>

        {/* KPI 2 — Plus grosse depense */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card-premium p-7 flex flex-col justify-between"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertTriangle size={18} className="text-red-500" />
            </div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Plus grosse depense</h3>
          </div>
          <div className="min-h-[60px] flex flex-col justify-center">
            {highestExpense ? (
              <>
                <p className="text-lg font-bold text-slate-900 truncate">{highestExpense.title}</p>
                <p className="text-2xl font-black text-red-500 mt-1">{fmt(Number(highestExpense.amount))} DH</p>
                <p className="text-xs text-slate-400 mt-2">{new Date(highestExpense.expense_date).toLocaleDateString('fr-FR')} &middot; {categoriesCount} categories</p>
              </>
            ) : (
              <p className="text-sm text-slate-400 italic">Aucune donnee</p>
            )}
          </div>
        </motion.div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-1"
        >
          <ExpensesChart expenses={filteredExpenses} />
        </motion.div>
      </div>

      {/* ── Toolbar ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-white rounded-2xl p-2 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-2 mb-8 items-center"
      >
        <div className="flex-1 flex items-center gap-3 px-4 w-full h-12 border-b md:border-b-0 md:border-r border-slate-100">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            type="text"
            className="w-full bg-transparent border-none focus:outline-none text-sm font-semibold text-slate-900 placeholder:text-slate-400"
            placeholder="Rechercher une depense..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 px-2 w-full md:w-auto">
          <input
            type="month"
            className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-700 text-xs font-bold h-10 px-4 rounded-xl outline-none cursor-pointer transition-colors"
            value={monthFilter}
            onChange={e => setMonthFilter(e.target.value)}
          />

          <div className="relative group flex items-center">
            <Filter size={14} className="absolute left-3 text-slate-400 group-hover:text-primary transition-colors pointer-events-none" />
            <select
              className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider h-10 pl-9 pr-8 rounded-xl outline-none cursor-pointer transition-colors w-full md:w-auto"
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
            >
              <option value="all">Toutes Categories</option>
              <option value="fuel">Carburant</option>
              <option value="maintenance">Entretien</option>
              <option value="parts">Pieces</option>
              <option value="insurance">Assurance</option>
              <option value="rent">Loyer</option>
              <option value="salary">Salaires</option>
              <option value="marketing">Marketing</option>
              <option value="utilities">Factures</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* ── Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="card-premium p-0 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Categorie</th>
                <th className="px-6 py-4">Vehicule</th>
                <th className="px-6 py-4">Montant</th>
                <th className="px-6 py-4">Justificatif</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-slate-700 divide-y divide-slate-50">
              <AnimatePresence>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
                      <p className="text-xs text-slate-400 mt-3 uppercase tracking-widest font-semibold">Chargement...</p>
                    </td>
                  </tr>
                ) : filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                        <AlertTriangle size={20} className="text-slate-400" />
                      </div>
                      <p className="text-sm text-slate-400 italic">Aucune depense trouvee.</p>
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((exp) => (
                    <motion.tr
                      key={exp.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-xs font-semibold">
                        {new Date(exp.expense_date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900 cursor-pointer hover:text-primary transition-colors" onClick={() => { setCurrentExpense(exp); setShowDrawer(true); }}>
                        {exp.title}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                          {exp.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        {exp.vehicle ? (
                          <span className="font-semibold text-slate-700">{exp.vehicle.brand} {exp.vehicle.model}</span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-black text-slate-900 tabular-nums">
                        {fmt(Number(exp.amount))} <span className="text-xs font-semibold text-slate-400">DH</span>
                      </td>
                      <td className="px-6 py-4">
                        {exp.receipt_url ? (
                          <a href={getImageUrl(exp.receipt_url) || '#'} target="_blank" rel="noreferrer" className="text-primary hover:text-primary-dark inline-flex items-center gap-1 text-xs font-bold">
                            <FileText size={14} /> Voir
                          </a>
                        ) : (
                          <span className="text-slate-300 text-xs">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-1">
                        <button
                          onClick={() => handleDelete(exp.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      <ExpenseFormDrawer
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        expense={currentExpense}
        onSave={fetchExpenses}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Supprimer la depense"
        message="Voulez-vous vraiment supprimer cette depense ?"
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        variant="danger"
        onConfirm={() => { pendingAction(); setConfirmOpen(false); }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
