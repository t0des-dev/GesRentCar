"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { Expense, Vehicle } from "@/types/admin";
import api from "@/shared/services/client";
import { toast } from "react-hot-toast";

interface ExpenseFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  expense?: Expense | null;
  onSave: () => void;
}

export default function ExpenseFormDrawer({ isOpen, onClose, expense, onSave }: ExpenseFormDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    expense_date: new Date().toISOString().split("T")[0],
    category: "fuel",
    vehicle_id: "",
    payment_method: "cash",
    notes: ""
  });
  
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen) {
      api.get('/vehicles').then(res => {
        setVehicles(Array.isArray(res.data) ? res.data : res.data.data ?? []);
      }).catch(console.error);
      
      if (expense) {
        setFormData({ // eslint-disable-line react-hooks/set-state-in-effect
          title: expense.title,
          amount: expense.amount.toString(),
          expense_date: expense.expense_date,
          category: expense.category,
          vehicle_id: expense.vehicle_id ? expense.vehicle_id.toString() : "",
          payment_method: expense.payment_method || "cash",
          notes: expense.notes || ""
        });
        setReceiptFile(null);
      } else {
        setFormData({
          title: "",
          amount: "",
          expense_date: new Date().toISOString().split("T")[0],
          category: "fuel",
          vehicle_id: "",
          payment_method: "cash",
          notes: ""
        });
        setReceiptFile(null);
      }
    }
  }, [isOpen, expense]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        vehicle_id: formData.vehicle_id ? parseInt(formData.vehicle_id) : null
      };

      let savedExpense;

      if (expense) {
        const { data } = await api.put(`/expenses/${expense.id}`, payload);
        savedExpense = data;
        toast.success("Dépense mise à jour");
      } else {
        const { data } = await api.post("/expenses", payload);
        savedExpense = data;
        toast.success("Dépense ajoutée");
      }

      if (receiptFile && savedExpense?.id) {
        const form = new FormData();
        form.append("receipt", receiptFile);
        await api.post(`/expenses/${savedExpense.id}/receipt`, form, {
          headers: { "Content-Type": undefined }
        });
        toast.success("Reçu téléversé avec succès");
      }

      onSave();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink-1/40 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-surface-0 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-2 bg-surface-1/50">
              <div>
                <h2 className="text-lg font-bold text-ink-1">
                  {expense ? "Modifier la dépense" : "Nouvelle dépense"}
                </h2>
                <p className="text-sm text-ink-2">
                  Remplissez les détails de la transaction
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-ink-3 hover:text-ink-2 hover:bg-surface-2 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <form id="expense-form" onSubmit={handleSubmit} className="space-y-6">
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-ink-2 mb-1">Titre de la dépense</label>
                    <input
                      type="text"
                      required
                      className="input-premium w-full"
                      placeholder="ex: Changement pneus avant"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-ink-2 mb-1">Montant (DH)</label>
                      <input
                        type="number"
                        required
                        step="0.01"
                        className="input-premium w-full"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={e => setFormData({ ...formData, amount: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-ink-2 mb-1">Date</label>
                      <input
                        type="date"
                        required
                        className="input-premium w-full"
                        value={formData.expense_date}
                        onChange={e => setFormData({ ...formData, expense_date: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-ink-2 mb-1">Catégorie</label>
                    <select
                      className="input-premium w-full"
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                    >
                      <optgroup label="Flotte / Véhicules">
                        <option value="fuel">Carburant</option>
                        <option value="maintenance">Entretien & Réparation</option>
                        <option value="parts">Pièces de rechange</option>
                        <option value="insurance">Assurance Véhicule</option>
                      </optgroup>
                      <optgroup label="Frais d'Agence">
                        <option value="rent">Loyer</option>
                        <option value="salary">Salaires</option>
                        <option value="marketing">Marketing & Publicité</option>
                        <option value="utilities">Électricité / Internet</option>
                        <option value="other">Autre</option>
                      </optgroup>
                    </select>
                  </div>

                  {["fuel", "maintenance", "parts", "insurance"].includes(formData.category) && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                      <label className="block text-sm font-semibold text-ink-2 mb-1">Véhicule associé (Optionnel)</label>
                      <select
                        className="input-premium w-full"
                        value={formData.vehicle_id}
                        onChange={e => setFormData({ ...formData, vehicle_id: e.target.value })}
                      >
                        <option value="">-- Aucun véhicule spécifique --</option>
                        {vehicles.map(v => (
                          <option key={v.id} value={v.id}>
                            {v.brand} {v.model} ({v.plate})
                          </option>
                        ))}
                      </select>
                    </motion.div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-ink-2 mb-1">Méthode de paiement</label>
                    <select
                      className="input-premium w-full"
                      value={formData.payment_method}
                      onChange={e => setFormData({ ...formData, payment_method: e.target.value })}
                    >
                      <option value="cash">Espèces</option>
                      <option value="card">Carte Bancaire</option>
                      <option value="transfer">Virement</option>
                      <option value="cheque">Chèque</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-ink-2 mb-1">Notes</label>
                    <textarea
                      className="input-premium w-full min-h-[80px] resize-y"
                      placeholder="Détails supplémentaires..."
                      value={formData.notes}
                      onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-ink-2 mb-1">Facture / Reçu</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-surface-3 border-dashed rounded-xl bg-surface-1 hover:bg-surface-2 transition-colors cursor-pointer relative">
                      <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept="image/*,.pdf"
                        onChange={e => setReceiptFile(e.target.files?.[0] || null)}
                      />
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-ink-3" />
                        <div className="flex text-sm text-ink-2 justify-center">
                          <span className="font-medium text-primary hover:text-primary-dark">
                            {receiptFile ? receiptFile.name : "Téléverser un fichier"}
                          </span>
                        </div>
                        <p className="text-xs text-ink-2">PNG, JPG, PDF jusqu&apos;a 5MB</p>
                      </div>
                    </div>
                  </div>

                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-surface-2 bg-surface-0">
              <button
                type="submit"
                form="expense-form"
                disabled={loading}
                className="w-full h-12 bg-ink-1 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-ink-2 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={18} />
                    {expense ? "Mettre à jour" : "Enregistrer la dépense"}
                  </>
                )}
              </button>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
