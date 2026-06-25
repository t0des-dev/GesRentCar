"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuthGuard } from "@/modules/auth/hooks/useAuthGuard";
import { Plus, Search, Filter, Trash2, FileText } from "lucide-react";
import api from "@/shared/services/client";
import { getImageUrl } from "@/shared/utils/image";
import { motion, AnimatePresence } from "framer-motion";
import { Expense } from "@/types/admin";
import ExpenseFormDrawer from "@/modules/admin/components/expenses/ExpenseFormDrawer";
import ExpensesChart from "@/modules/admin/components/expenses/ExpensesChart";
import { toast } from "react-hot-toast";
import { fmt } from "@/shared/utils/format";

export default function ExpensesPage() {
  const { user, checking } = useAuthGuard("admin");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);

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
      toast.error("Erreur de synchronisation des dépenses.");
    } finally {
      setLoading(false);
    }
  }, [monthFilter, categoryFilter]);

  useEffect(() => {
    if (!checking && user) fetchExpenses(); // eslint-disable-line react-hooks/set-state-in-effect
  }, [fetchExpenses, checking, user]);

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette dépense ?")) return;
    try {
      await api.delete(`/expenses/${id}`);
      toast.success("Dépense supprimée.");
      fetchExpenses();
    } catch {
      toast.error("Erreur lors de la suppression.");
    }
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

  if (checking) return null;

  return (
    <>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-primary mb-2">Trésorerie</p>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Gestion des <span className="italic text-primary">Dépenses</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => { setCurrentExpense(null); setShowDrawer(true); }} className="btn-primary">
            <Plus size={16} /> Nouvelle Dépense
          </button>
        </div>
      </header>

      {/* KPIs & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="card-premium bg-slate-900 text-white flex-1 flex flex-col justify-center">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Total des dépenses</h3>
            <p className="text-4xl font-black">{fmt(totalAmount)} <span className="text-xl font-bold text-slate-500">DH</span></p>
            <p className="text-xs text-slate-400 mt-2">Pour la période sélectionnée</p>
          </div>
          
          <div className="card-premium flex-1 flex flex-col justify-center">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Plus grosse dépense</h3>
            {highestExpense ? (
              <>
                <p className="text-xl font-bold text-slate-900 truncate">{highestExpense.title}</p>
                <p className="text-lg font-black text-red-500">{fmt(Number(highestExpense.amount))} DH</p>
                <p className="text-xs text-slate-500 mt-1">{new Date(highestExpense.expense_date).toLocaleDateString('fr-FR')}</p>
              </>
            ) : (
              <p className="text-sm text-slate-500 italic">Aucune donnée</p>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <ExpensesChart expenses={filteredExpenses} />
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-2 mb-6 items-center">
        <div className="flex-1 flex items-center gap-3 px-4 w-full h-12 border-b md:border-b-0 md:border-r border-slate-100">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            type="text"
            className="w-full bg-transparent border-none focus:outline-none text-sm font-semibold text-slate-900 placeholder:text-slate-400"
            placeholder="Rechercher une dépense..."
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
              <option value="all">Toutes Catégories</option>
              <option value="fuel">Carburant</option>
              <option value="maintenance">Entretien</option>
              <option value="parts">Pièces</option>
              <option value="insurance">Assurance</option>
              <option value="rent">Loyer</option>
              <option value="salary">Salaires</option>
              <option value="marketing">Marketing</option>
              <option value="utilities">Factures</option>
            </select>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="card-premium p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                <th className="p-4 pl-6">Date</th>
                <th className="p-4">Description</th>
                <th className="p-4">Catégorie</th>
                <th className="p-4">Véhicule</th>
                <th className="p-4">Montant</th>
                <th className="p-4">Justificatif</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-slate-700 divide-y divide-slate-100">
              <AnimatePresence>
                {loading ? (
                   <tr>
                    <td colSpan={7} className="p-12 text-center">
                      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-slate-400 italic">Aucune dépense trouvée.</td>
                  </tr>
                ) : (
                  filteredExpenses.map((exp) => (
                    <motion.tr 
                      key={exp.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="p-4 pl-6 whitespace-nowrap text-slate-500">
                        {new Date(exp.expense_date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="p-4 font-bold text-slate-900 cursor-pointer" onClick={() => { setCurrentExpense(exp); setShowDrawer(true); }}>
                        {exp.title}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                          {exp.category}
                        </span>
                      </td>
                      <td className="p-4 text-xs">
                        {exp.vehicle ? (
                          <span className="font-semibold">{exp.vehicle.brand} {exp.vehicle.model}</span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="p-4 font-black text-slate-900">
                        {fmt(Number(exp.amount))} DH
                      </td>
                      <td className="p-4">
                        {exp.receipt_url ? (
                          <a href={getImageUrl(exp.receipt_url) || '#'} target="_blank" rel="noreferrer" className="text-primary hover:text-primary-dark inline-flex items-center gap-1 text-xs font-bold">
                            <FileText size={14} /> Voir
                          </a>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="p-4 text-right pr-6 space-x-2">
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
      </div>

      <ExpenseFormDrawer 
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        expense={currentExpense}
        onSave={fetchExpenses}
      />
    </>
  );
}
