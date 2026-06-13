"use client";

import { motion } from "framer-motion";
import { X, Loader2, CheckCircle, Plus, Globe } from "lucide-react";
import { Vehicle } from "@/types/admin";
import api from "@/lib/api/client";

interface VehicleFormModalProps {
  vehicle: any;
  setVehicle: (v: any) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  categoryPrices: Record<string, number>;
}

export default function VehicleFormModal({
  vehicle,
  setVehicle,
  onClose,
  onSubmit,
  submitting,
  categoryPrices
}: VehicleFormModalProps) {

  const handleCategoryChange = (cat: string) => {
    const basePrice = categoryPrices[cat] || 350;
    setVehicle({
      ...vehicle,
      category: cat,
      price_per_day: vehicle.id ? vehicle.price_per_day : basePrice
    });
  };

  return (
    <div className="fixed inset-0 bg-ink-1/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-surface-0 w-full max-w-3xl max-h-[90vh] rounded-2xl overflow-y-auto shadow-xl border-2 border-border/60">
        <div className="p-8 pb-4 flex justify-between items-center border-b border-border">
          <h3 className="text-xl font-bold text-ink-1">{vehicle?.id ? "Raffiner le véhicule" : "Nouvel Actif"}</h3>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onClose} className="p-2 text-ink-3 hover:text-red-500 transition-colors rounded-xl hover:bg-red-50"><X size={24} /></motion.button>
        </div>

        <form onSubmit={onSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="flex flex-col gap-2">
               <label className="text-xs font-bold uppercase tracking-wider text-ink-3">Image Principale (Mise en avant)</label>
               <div className="flex items-center gap-6 p-6 bg-surface-1 rounded-2xl border-2 border-border">
                  <div className="w-40 h-24 rounded-2xl overflow-hidden border-2 border-border bg-surface-0">
                    <img
                      src={vehicle.new_image ? URL.createObjectURL(vehicle.new_image) : (vehicle.image_url ? `http://localhost:8000${vehicle.image_url}` : '')}
                      className="w-full h-full object-cover"
                      alt="Main"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      id="main_image"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setVehicle({ ...vehicle, new_image: file });
                      }}
                    />
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => document.getElementById('main_image')?.click()}
                      className="border-2 border-border text-ink-2 px-6 h-12 rounded-xl font-bold text-sm hover:bg-surface-1 transition-colors cursor-pointer"
                    >
                      Choisir une nouvelle image
                    </motion.button>
                  </div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-3">Galerie Photo (Multi-images)</label>
              <div className="grid grid-cols-4 gap-3 mt-2">
                {vehicle?.photos?.map((url: string, i: number) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-2 border-border">
                    <img src={`http://localhost:8000${url}`} alt="Gallery" className="w-full h-full object-cover" />
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-lg flex items-center justify-center cursor-pointer transition-transform"
                      onClick={() => {
                        const newPhotos = [...vehicle.photos];
                        newPhotos.splice(i, 1);
                        setVehicle({ ...vehicle, photos: newPhotos });
                      }}
                    >
                      <X size={14} />
                    </motion.button>
                  </div>
                ))}
                <label className="aspect-square border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary hover:bg-surface-1 transition-colors text-primary">
                  <input
                    type="file"
                    multiple
                    hidden
                    onChange={async (e) => {
                      const files = e.target.files;
                      if (!files?.length) return;

                      if (vehicle.id) {
                        const formData = new FormData();
                        Array.from(files).forEach(f => formData.append("photos[]", f));
                        try {
                          const res = await api.post(`/vehicles/${vehicle.id}/photos`, formData, {
                            headers: { "Content-Type": "multipart/form-data" }
                          });
                          setVehicle({ ...vehicle, photos: res.data.photos });
                        } catch (err) { alert("Erreur upload photos"); }
                      } else {
                        alert("Veuillez d'abord créer le véhicule avant d'ajouter une galerie.");
                      }
                    }}
                  />
                  <Plus size={24} />
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-3">Ajouter</span>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-3">Marque</label>
              <input required type="text" className="input-premium" value={vehicle.brand} onChange={e => setVehicle({...vehicle, brand: e.target.value})} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-3">Modèle</label>
              <input required type="text" className="input-premium" value={vehicle.model} onChange={e => setVehicle({...vehicle, model: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-3">Plaque d'immatriculation</label>
              <input required type="text" className="input-premium" value={vehicle.plate} onChange={e => setVehicle({...vehicle, plate: e.target.value})} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-3">Prix par jour (DH)</label>
              <input required type="number" className="input-premium" value={vehicle.price_per_day} onChange={e => setVehicle({...vehicle, price_per_day: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-3">Kilométrage</label>
              <input type="number" className="input-premium" value={vehicle.mileage || ""} onChange={e => setVehicle({...vehicle, mileage: e.target.value})} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-3">Année</label>
              <input type="number" className="input-premium" value={vehicle.year || ""} onChange={e => setVehicle({...vehicle, year: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-3">Carburant</label>
              <select className="input-premium" value={vehicle.fuel_type || "Diesel"} onChange={e => setVehicle({...vehicle, fuel_type: e.target.value})}>
                <option value="Diesel">Diesel</option>
                <option value="Essence">Essence</option>
                <option value="Hybride">Hybride</option>
                <option value="Electrique">Electrique</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-3">Puissance (CV)</label>
              <input type="text" className="input-premium" value={vehicle.horsepower || ""} onChange={e => setVehicle({...vehicle, horsepower: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-3">Couleur</label>
              <input type="text" className="input-premium" value={vehicle.color || ""} onChange={e => setVehicle({...vehicle, color: e.target.value})} placeholder="Ex: Noir Profond" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-3">Expiration Assurance</label>
              <input type="date" className="input-premium" value={vehicle.insurance_date || ""} onChange={e => setVehicle({...vehicle, insurance_date: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-3">Type de Gestion</label>
              <select className="input-premium" value={vehicle.type} onChange={e => setVehicle({...vehicle, type: e.target.value})}>
                <option value="internal">Interne (Agence)</option>
                <option value="collaborator">Partenaire (Collaborateur)</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-3">Catégorie</label>
              <select className="input-premium" value={vehicle.category || "standard"} onChange={e => handleCategoryChange(e.target.value)}>
                <option value="eco">Économique</option>
                <option value="standard">Standard</option>
                <option value="suv">SUV / 4x4</option>
                <option value="luxury">Luxe / Prestige</option>
                <option value="sport">Sport / Cabriolet</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2" style={{ marginTop: '2rem' }}>
             <label className="text-xs font-bold uppercase tracking-wider text-ink-3">Statut Actuel</label>
             <select className="input-premium" value={vehicle.status} onChange={e => setVehicle({...vehicle, status: e.target.value})}>
                <option value="available">Disponible</option>
                <option value="maintenance">En Maintenance</option>
                <option value="rented">Déjà Loué</option>
              </select>
          </div>

          <div className="mt-12 pt-12 border-t border-border">
            <div className="flex items-center gap-3 mb-8">
              <Globe className="text-primary" size={20} />
              <h4 className="text-sm font-bold uppercase tracking-widest text-ink-2">Optimisation SEO & Partage (FB/WhatsApp)</h4>
            </div>

            <div className="flex flex-col gap-2" style={{ marginBottom: '1.5rem' }}>
              <label className="text-xs font-bold uppercase tracking-wider text-ink-3">Meta Titre SEO</label>
              <input type="text" className="input-premium" value={vehicle.seo_title || ""} onChange={e => setVehicle({...vehicle, seo_title: e.target.value})} placeholder="Ex: Louez la Mercedes Classe S à Marrakech | Vectoria" />
            </div>

            <div className="flex flex-col gap-2" style={{ marginBottom: '1.5rem' }}>
              <label className="text-xs font-bold uppercase tracking-wider text-ink-3">Meta Description SEO</label>
              <textarea className="input-premium" value={vehicle.seo_description || ""} onChange={e => setVehicle({...vehicle, seo_description: e.target.value})} placeholder="Ex: Profitez du luxe ultime avec notre Mercedes Classe S. Service de conciergerie 24/7..." rows={3} />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-3">URL Image de Partage (OpenGraph)</label>
              <input type="text" className="input-premium" value={vehicle.og_image_url || ""} onChange={e => setVehicle({...vehicle, og_image_url: e.target.value})} placeholder="URL de l'image optimisée pour les réseaux sociaux" />
              <p className="text-[9px] text-ink-3 mt-2 italic">Si vide, l'image principale sera utilisée par défaut.</p>
            </div>
          </div>

          <div className="flex gap-6 mt-12">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="bg-gradient-to-r from-gold to-gold/90 text-ink-1 w-full rounded-xl h-12 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
              disabled={submitting}
            >
              {submitting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
              Sauvegarder l'Actif
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
