"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuthGuard } from "@/modules/auth/hooks/useAuthGuard";
import { useAgency } from "@/hooks/useAgency";
import { Plus } from "lucide-react";
import api from "@/shared/services/client";
import { motion, AnimatePresence } from "framer-motion";
import { ConfirmDialog } from "@/components/Notifications";
import { toast } from "react-hot-toast";

// Types
import { Vehicle, Maintenance } from "@/types/admin";

// Modular Components
import FleetToolbar from "@/modules/admin/components/fleet/FleetToolbar";
import VehicleCardAdmin from "@/modules/admin/components/fleet/VehicleCardAdmin";
import VehicleFormDrawer from "@/modules/admin/components/fleet/VehicleFormDrawer";
import MaintenanceModal from "@/modules/admin/components/fleet/MaintenanceModal";
import FleetKPIs from "@/modules/admin/components/fleet/FleetKPIs";
import FleetDisplaySettings from "@/modules/admin/components/fleet/FleetDisplaySettings";

export default function FleetPage() {
  const { user, checking } = useAuthGuard("admin");
  const agency = useAgency();
  
  // Data States
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  
  // UI States
  const [loading, setLoading] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  // Filter States
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
  // Notification States
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Confirm Dialog States
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<() => void>(() => {});
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmVariant, setConfirmVariant] = useState<"danger" | "warning" | "info">("danger");

  const showSuccess = (msg: string) => {
    toast.success(msg);
  };

  const showError = (msg: string) => {
    toast.error(msg);
  };

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/vehicles?per_page=100');
      const data = res.data;
      setVehicles(Array.isArray(data) ? data : data.data ?? []);
    } catch {
      showError("Erreur lors de la synchronisation de la flotte.");
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { 
    if (!checking && user) fetchVehicles(); 
  }, [fetchVehicles, checking, user]);

  const handleEdit = (v: Vehicle) => {
    setCurrentVehicle({ ...v, new_image: null });
    setShowDrawer(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, vehicleId: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      await api.post(`/vehicles/${vehicleId}/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      showSuccess("Image mise à jour avec succès !");
      fetchVehicles();
    } catch {
      showError("Erreur lors de l'upload de l'image.");
    }
  };

  const fetchMaintenances = async (vehicleId: number) => {
    try {
      const res = await api.get(`/maintenances?vehicle_id=${vehicleId}`);
      setMaintenances(res.data);
      setCurrentVehicle(vehicles.find(v => v.id === vehicleId));
      setShowMaintenanceModal(true);
    } catch {
      showError("Erreur lors de la récupération de la maintenance.");
    }
  };

  const handleDelete = async (id: number) => {
    setPendingAction(() => async () => {
      setDeletingId(id);
      try {
        await api.delete(`/vehicles/${id}`);
        showSuccess("Véhicule supprimé.");
        fetchVehicles();
      } catch {
        showError("Erreur lors de la suppression.");
      } finally {
        setDeletingId(null);
      }
    });
    setConfirmTitle("Supprimer le vehicule");
    setConfirmMessage("Voulez-vous vraiment supprimer ce vehicule definitivement ?");
    setConfirmVariant("danger");
    setConfirmOpen(true);
  };

  const handleBulkDelete = async () => {
    setPendingAction(() => async () => {
      setLoading(true);
      try {
        await Promise.all(selectedIds.map(id => api.delete(`/vehicles/${id}`)));
        showSuccess(`${selectedIds.length} véhicule(s) supprimé(s).`);
        setSelectedIds([]);
        fetchVehicles();
      } catch {
        showError("Erreur lors de la suppression de groupe.");
        setLoading(false);
      }
    });
    setConfirmTitle("Supprimer les vehicules");
    setConfirmMessage(`Supprimer definitivement ${selectedIds.length} vehicule(s) ?`);
    setConfirmVariant("danger");
    setConfirmOpen(true);
  };

  const handleBulkStatusChange = async (newStatus: string) => {
    setPendingAction(() => async () => {
      setLoading(true);
      try {
        await Promise.all(selectedIds.map(id => api.put(`/vehicles/${id}`, { status: newStatus })));
        showSuccess(`Statut mis à jour pour ${selectedIds.length} véhicule(s).`);
        setSelectedIds([]);
        fetchVehicles();
      } catch {
        showError("Erreur lors de la mise à jour de groupe.");
        setLoading(false);
      }
    });
    setConfirmTitle("Changer le statut");
    setConfirmMessage(`Changer le statut de ${selectedIds.length} vehicule(s) en ${newStatus} ?`);
    setConfirmVariant("warning");
    setConfirmOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentVehicle) return;

    setSubmitting(true);
    
    try {
      const allowedFields = [
        'brand', 'model', 'plate', 'price_per_day', 'status', 'category', 
        'type', 'mileage', 'fuel_type', 'horsepower', 'year', 'color',
        'insurance_date', 'tech_inspection_date', 'vignette_date', 'description_fr',
        'seo_title', 'seo_description', 'og_image_url'
      ];

      const cleanData: any = {};
      allowedFields.forEach(field => {
        const val = currentVehicle[field];
        if (val !== undefined && val !== null && val !== "") {
          if (field === 'plate') cleanData[field] = String(val).toUpperCase().trim();
          else if (field.endsWith('_date')) cleanData[field] = new Date(val).toISOString().split('T')[0];
          else if (['price_per_day', 'year', 'mileage'].includes(field)) cleanData[field] = Number(val);
          else cleanData[field] = val;
        }
      });

      if (currentVehicle.photos) cleanData.photos = currentVehicle.photos;

      let savedVehicle;
      if (currentVehicle?.id) {
        const res = await api.put(`/vehicles/${currentVehicle.id}`, cleanData);
        savedVehicle = res.data;
      } else {
        const res = await api.post(`/vehicles`, cleanData);
        savedVehicle = res.data;
      }

      if (currentVehicle.new_image && savedVehicle?.id) {
        const formData = new FormData();
        formData.append("image", currentVehicle.new_image);
        await api.post(`/vehicles/${savedVehicle.id}/image`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      showSuccess("Véhicule sauvegardé !");
      setShowDrawer(false);
      fetchVehicles();
    } catch (err: any) {
      let errorText = err.response?.data?.message || err.message;
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const firstErrorKey = Object.keys(errors)[0];
        errorText = errors[firstErrorKey][0];
      }
      showError(`Erreur: ${errorText}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Marque", "Modèle", "Plaque", "Catégorie", "Statut", "Prix", "Année", "KMs"];
    const rows = filtered.map(v => [
      v.id, v.brand, v.model, v.plate, v.category, v.status, v.price_per_day, v.year, v.mileage
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `inventaire_flotte_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = useMemo(() => vehicles.filter(v => {
    const matchSearch = v.brand.toLowerCase().includes(search.toLowerCase()) || 
                        v.model.toLowerCase().includes(search.toLowerCase()) ||
                        v.plate.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || v.status === statusFilter;
    const matchCategory = categoryFilter === 'all' || v.category === categoryFilter;
    return matchSearch && matchStatus && matchCategory;
  }), [vehicles, search, statusFilter, categoryFilter]);

  const toggleSelection = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // KPIs Calculations
  const checkExpiry = (dateStr?: string) => {
    if (!dateStr) return false;
    const days = (new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
    return days < 30; // expired or expiring in < 30 days
  };

  const alertCount = vehicles.filter(v => checkExpiry(v.insurance_date) || checkExpiry(v.tech_inspection_date) || checkExpiry(v.vignette_date)).length;

  if (checking) return null;

  return (
    <>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-primary mb-2">Gestion d'Actifs</p>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Showroom <span className="italic text-primary">Privé</span></h1>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button className="btn-primary" onClick={() => { setCurrentVehicle({ brand: "", model: "", plate: "", price_per_day: 0, year: 2024, fuel_type: "Diesel", status: "available", type: "internal", category: "standard" }); setShowDrawer(true); }}>
            <Plus size={16} /> Nouveau Véhicule
          </button>
        </div>
      </header>

      <FleetDisplaySettings className="mb-8" />

      <FleetKPIs 
        total={vehicles.length}
        available={vehicles.filter(v => v.status === 'available').length}
        maintenance={vehicles.filter(v => v.status === 'maintenance').length}
        alerts={alertCount}
      />

      <FleetToolbar 
        search={search} setSearch={setSearch} 
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
        onAdd={() => setShowDrawer(true)} 
        count={filtered.length} 
        onExport={handleExportCSV}
        selectedIds={selectedIds}
        onClearSelection={() => setSelectedIds([])}
        onBulkDelete={handleBulkDelete}
        onBulkStatusChange={handleBulkStatusChange}
      />

      {loading && vehicles.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Synchronisation de la flotte...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((v, idx) => (
              <VehicleCardAdmin 
                key={v.id} 
                vehicle={v} 
                idx={idx} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
                onHistory={fetchMaintenances} 
                onImageUpload={handleImageUpload}
                deletingId={deletingId}
                isSelected={selectedIds.includes(v.id!)}
                onSelect={toggleSelection}
              />
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 italic">
              Aucun véhicule trouvé pour ces critères.
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {showDrawer && (
          <VehicleFormDrawer 
            vehicle={currentVehicle} 
            setVehicle={setCurrentVehicle} 
            onClose={() => setShowDrawer(false)} 
            onSubmit={handleSubmit} 
            submitting={submitting}
            categoryPrices={agency.category_prices || {}}
          />
        )}
      </AnimatePresence>

      {showMaintenanceModal && (
        <MaintenanceModal 
          vehicle={currentVehicle} 
          maintenances={maintenances} 
          onClose={() => setShowMaintenanceModal(false)} 
          onRefresh={() => { fetchMaintenances(currentVehicle.id); fetchVehicles(); }} 
        />
      )}

      <ConfirmDialog
        open={confirmOpen}
        title={confirmTitle}
        message={confirmMessage}
        confirmLabel="Confirmer"
        cancelLabel="Annuler"
        variant={confirmVariant}
        onConfirm={() => { pendingAction(); setConfirmOpen(false); }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
