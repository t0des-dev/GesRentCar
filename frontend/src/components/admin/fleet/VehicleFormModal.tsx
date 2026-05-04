"use client";

import { motion } from "framer-motion";
import { X, Loader2, CheckCircle, Plus, Globe } from "lucide-react";
import { Vehicle } from "@/types/admin";
import styles from "@/app/admin/fleet/page.module.css";
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
    <div className={styles.modalOverlay}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>{vehicle?.id ? "Raffiner le véhicule" : "Nouvel Actif"}</h3>
          <button onClick={onClose}><X size={24} /></button>
        </div>
        
        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.formRow} style={{ gridTemplateColumns: '1fr' }}>
            <div className={styles.inputGroup}>
               <label>Image Principale (Mise en avant)</label>
               <div className="flex items-center gap-6 p-6 bg-[#FDFCFB] rounded-[30px] border border-[#F5E6D3]">
                  <div className="w-40 h-24 rounded-2xl overflow-hidden border border-[#F5E6D3] bg-white">
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
                    <button 
                      type="button" 
                      onClick={() => document.getElementById('main_image')?.click()}
                      className="px-6 py-3 bg-[#1A1A1A] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#C5A059] transition-colors"
                    >
                      Choisir une nouvelle image
                    </button>
                  </div>
               </div>
            </div>
          </div>

          <div className={styles.formRow} style={{ gridTemplateColumns: '1fr' }}>
            <div className={styles.inputGroup}>
              <label>Galerie Photo (Multi-images)</label>
              <div className={styles.galleryGrid}>
                {vehicle?.photos?.map((url: string, i: number) => (
                  <div key={i} className={styles.galleryItem}>
                    <img src={`http://localhost:8000${url}`} alt="Gallery" />
                    <button 
                      type="button" 
                      className={styles.removePhoto}
                      onClick={() => {
                        const newPhotos = [...vehicle.photos];
                        newPhotos.splice(i, 1);
                        setVehicle({ ...vehicle, photos: newPhotos });
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <label className={styles.uploadPlaceholder}>
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
                  <span>Ajouter</span>
                </label>
              </div>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label>Marque</label>
              <input required type="text" value={vehicle.brand} onChange={e => setVehicle({...vehicle, brand: e.target.value})} />
            </div>
            <div className={styles.inputGroup}>
              <label>Modèle</label>
              <input required type="text" value={vehicle.model} onChange={e => setVehicle({...vehicle, model: e.target.value})} />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label>Plaque d'immatriculation</label>
              <input required type="text" value={vehicle.plate} onChange={e => setVehicle({...vehicle, plate: e.target.value})} />
            </div>
            <div className={styles.inputGroup}>
              <label>Prix par jour (DH)</label>
              <input required type="number" value={vehicle.price_per_day} onChange={e => setVehicle({...vehicle, price_per_day: e.target.value})} />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label>Kilométrage</label>
              <input type="number" value={vehicle.mileage || ""} onChange={e => setVehicle({...vehicle, mileage: e.target.value})} />
            </div>
            <div className={styles.inputGroup}>
              <label>Année</label>
              <input type="number" value={vehicle.year || ""} onChange={e => setVehicle({...vehicle, year: e.target.value})} />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label>Carburant</label>
              <select value={vehicle.fuel_type || "Diesel"} onChange={e => setVehicle({...vehicle, fuel_type: e.target.value})}>
                <option value="Diesel">Diesel</option>
                <option value="Essence">Essence</option>
                <option value="Hybride">Hybride</option>
                <option value="Electrique">Electrique</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label>Puissance (CV)</label>
              <input type="text" value={vehicle.horsepower || ""} onChange={e => setVehicle({...vehicle, horsepower: e.target.value})} />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label>Couleur</label>
              <input type="text" value={vehicle.color || ""} onChange={e => setVehicle({...vehicle, color: e.target.value})} placeholder="Ex: Noir Profond" />
            </div>
            <div className={styles.inputGroup}>
              <label>Expiration Assurance</label>
              <input type="date" value={vehicle.insurance_date || ""} onChange={e => setVehicle({...vehicle, insurance_date: e.target.value})} />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label>Type de Gestion</label>
              <select value={vehicle.type} onChange={e => setVehicle({...vehicle, type: e.target.value})}>
                <option value="internal">Interne (Agence)</option>
                <option value="collaborator">Partenaire (Collaborateur)</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label>Catégorie</label>
              <select value={vehicle.category || "standard"} onChange={e => handleCategoryChange(e.target.value)}>
                <option value="eco">Économique</option>
                <option value="standard">Standard</option>
                <option value="suv">SUV / 4x4</option>
                <option value="luxury">Luxe / Prestige</option>
                <option value="sport">Sport / Cabriolet</option>
              </select>
            </div>
          </div>
          
          <div className={styles.inputGroup} style={{ marginTop: '2rem' }}>
             <label>Statut Actuel</label>
             <select value={vehicle.status} onChange={e => setVehicle({...vehicle, status: e.target.value})}>
                <option value="available">Disponible</option>
                <option value="maintenance">En Maintenance</option>
                <option value="rented">Déjà Loué</option>
              </select>
          </div>

          {/* ── SEO Section ── */}
          <div className="mt-12 pt-12 border-t border-[#F5E6D3]">
            <div className="flex items-center gap-3 mb-8">
              <Globe className="text-[#C5A059]" size={20} />
              <h4 className="text-sm font-black uppercase tracking-widest text-[#1A1A1A]">Optimisation SEO & Partage (FB/WhatsApp)</h4>
            </div>
            
            <div className={styles.inputGroup} style={{ marginBottom: '1.5rem' }}>
              <label>Meta Titre SEO</label>
              <input type="text" value={vehicle.seo_title || ""} onChange={e => setVehicle({...vehicle, seo_title: e.target.value})} placeholder="Ex: Louez la Mercedes Classe S à Marrakech | Vectoria" />
            </div>
            
            <div className={styles.inputGroup} style={{ marginBottom: '1.5rem' }}>
              <label>Meta Description SEO</label>
              <textarea value={vehicle.seo_description || ""} onChange={e => setVehicle({...vehicle, seo_description: e.target.value})} placeholder="Ex: Profitez du luxe ultime avec notre Mercedes Classe S. Service de conciergerie 24/7..." rows={3} />
            </div>

            <div className={styles.inputGroup}>
              <label>URL Image de Partage (OpenGraph)</label>
              <input type="text" value={vehicle.og_image_url || ""} onChange={e => setVehicle({...vehicle, og_image_url: e.target.value})} placeholder="URL de l'image optimisée pour les réseaux sociaux" />
              <p className="text-[9px] text-slate-400 mt-2 italic">Si vide, l'image principale sera utilisée par défaut.</p>
            </div>
          </div>

          <div className="flex gap-6 mt-12">
            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
              Sauvegarder l'Actif
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
