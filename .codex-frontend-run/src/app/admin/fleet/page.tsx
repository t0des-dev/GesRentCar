"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useAgency } from "@/hooks/useAgency";
import { Plus, X } from "lucide-react";
import api from "@/lib/api/client";
import { motion, AnimatePresence } from "framer-motion";

// Types
import { Vehicle, Maintenance } from "@/types/admin";

// Modular Components
import FleetToolbar from "@/components/admin/fleet/FleetToolbar";
import VehicleCardAdmin from "@/components/admin/fleet/VehicleCardAdmin";
import VehicleFormModal from "@/components/admin/fleet/VehicleFormModal";
import MaintenanceModal from "@/components/admin/fleet/MaintenanceModal";

export default function FleetPage() {
  const { user, checking } = useAuthGuard("admin");
  const agency = useAgency();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<any>(null);
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/vehicles');
      const data = res.data;
      setVehicles(Array.isArray(data) ? data : data.data ?? []);
    } catch {
      setErrorMsg("Erreur lors de la synchronisation de la flotte.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    if (!checking && user) fetchVehicles(); 
  }, [fetchVehicles, checking, user]);

  const handleEdit = (v: Vehicle) => {
    setCurrentVehicle({ ...v, new_image: null });
    setShowModal(true);
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
      setSuccessMsg("Image mise à jour avec succès !");
      setTimeout(() => setSuccessMsg(""), 3000);
      fetchVehicles();
    } catch {
      setErrorMsg("Erreur lors de l'upload de l'image.");
    }
  };

  const fetchMaintenances = async (vehicleId: number) => {
    try {
      const res = await api.get(`/maintenances?vehicle_id=${vehicleId}`);
      setMaintenances(res.data);
      setShowMaintenanceModal(true);
    } catch {
      setErrorMsg("Erreur lors de la récupération de la maintenance.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce véhicule définitivement ?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/vehicles/${id}`);
      setSuccessMsg("Véhicule supprimé.");
      setTimeout(() => setSuccessMsg(""), 3000);
      fetchVehicles();
    } catch {
      setErrorMsg("Erreur lors de la suppression.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentVehicle) return;

    setSubmitting(true);
    setErrorMsg("");
    
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

      setSuccessMsg("Véhicule mis à jour !");
      setTimeout(() => setSuccessMsg(""), 3000);
      setShowModal(false);
      fetchVehicles();
    } catch (err: any) {
      setErrorMsg(`Erreur: ${err.response?.data?.message || err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = useMemo(() => vehicles.filter(v => 
    v.brand.toLowerCase().includes(search.toLowerCase()) || 
    v.model.toLowerCase().includes(search.toLowerCase()) ||
    v.plate.toLowerCase().includes(search.toLowerCase())
  ), [vehicles, search]);

  if (checking) return null;

  return (
    <div className="page-container p-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-primary mb-2">Gestion d'Actifs</p>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Showroom <span className="italic text-primary">Privé</span></h1>
        </div>
        <div className="flex flex-col items-end gap-2">
          <AnimatePresence>
            {successMsg && <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="bg-emerald-500 text-white px-5 py-2 rounded-xl text-[10px] font-semibold uppercase tracking-wider shadow-sm">{successMsg}</motion.div>}
            {errorMsg && <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="bg-red-500 text-white px-5 py-2 rounded-xl text-[10px] font-semibold uppercase tracking-wider shadow-sm">{errorMsg}</motion.div>}
          </AnimatePresence>
          <button className="btn-primary" onClick={() => { setCurrentVehicle({ brand: "", model: "", plate: "", price_per_day: 0, year: 2024, fuel_type: "Diesel", status: "available", type: "internal" }); setShowModal(true); }}>
            <Plus size={16} /> Nouveau Véhicule
          </button>
        </div>
      </header>

      <FleetToolbar search={search} setSearch={setSearch} onAdd={() => setShowModal(true)} count={filtered.length} />

      {loading ? (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
          <div className="w-12 h-12 border-[3px] border-slate-200 border-t-primary rounded-full animate-spin" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.5em] text-primary">Synchronisation de la flotte...</p>
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
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {showModal && (
        <VehicleFormModal 
          vehicle={currentVehicle} 
          setVehicle={setCurrentVehicle} 
          onClose={() => setShowModal(false)} 
          onSubmit={handleSubmit} 
          submitting={submitting}
          categoryPrices={agency.category_prices || {}}
        />
      )}

      {showMaintenanceModal && (
        <MaintenanceModal 
          vehicle={currentVehicle} 
          maintenances={maintenances} 
          onClose={() => setShowMaintenanceModal(false)} 
          onRefresh={() => { fetchMaintenances(currentVehicle.id); fetchVehicles(); }} 
        />
      )}
    </div>
  );
}
