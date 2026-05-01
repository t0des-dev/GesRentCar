"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useAgency } from "@/hooks/useAgency";
import { 
  Car, Plus, Edit, Trash2, Search, 
  Settings, AlertTriangle, CheckCircle,
  Loader2, Filter, X, Camera, Wrench, History,
  TrendingUp, Calendar, MapPin, Gauge, Star,
  ShieldCheck, ArrowRight, Fuel
} from "lucide-react";
import styles from "./page.module.css";
import api from "@/lib/api/client";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── Main Component ──────────────────────────────────────────────────────────
export default function FleetPage() {
  const { user, checking } = useAuthGuard("admin");
  const agency = useAgency();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<any>(null);
  const [maintenances, setMaintenances] = useState<any[]>([]);
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

  const handleEdit = (v: any) => {
    // Clear previous temporary state
    setCurrentVehicle({ ...v, new_image: null });
    setShowModal(true);
  };

  const handleCategoryChange = (cat: string) => {
    const basePrice = agency.category_prices?.[cat] || 350;
    setCurrentVehicle({
      ...currentVehicle, 
      category: cat,
      price_per_day: currentVehicle.id ? currentVehicle.price_per_day : basePrice
    });
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
    setSuccessMsg("");
    
    try {
      let savedVehicle;
      
      const allowedFields = [
        'brand', 'model', 'plate', 'price_per_day', 'status', 'category', 
        'type', 'mileage', 'fuel_type', 'horsepower', 'year', 'color',
        'insurance_date', 'tech_inspection_date', 'vignette_date', 'description_fr'
      ];

      const cleanData: any = {};
      allowedFields.forEach(field => {
        const val = currentVehicle[field];
        if (val !== undefined && val !== null && val !== "") {
          if (field === 'plate') {
            cleanData[field] = String(val).toUpperCase().trim();
          } else if (field.endsWith('_date')) {
            const d = new Date(val);
            if (!isNaN(d.getTime())) {
              cleanData[field] = d.toISOString().split('T')[0];
            }
          } else if (['price_per_day', 'year', 'mileage'].includes(field)) {
            cleanData[field] = Number(val);
          } else {
            cleanData[field] = val;
          }
        }
      });

      // Special handling for photos array
      if (currentVehicle.photos && Array.isArray(currentVehicle.photos)) {
        cleanData.photos = currentVehicle.photos;
      }

      console.log("🚀 ENVOI AU SERVEUR :", cleanData);

      if (currentVehicle?.id) {
        const res = await api.put(`/vehicles/${currentVehicle.id}`, cleanData);
        savedVehicle = res.data;
      } else {
        const res = await api.post(`/vehicles`, cleanData);
        savedVehicle = res.data;
      }

      console.log("✅ RÉPONSE SERVEUR :", savedVehicle);

      if (currentVehicle.new_image && savedVehicle?.id) {
        try {
          const formData = new FormData();
          formData.append("image", currentVehicle.new_image);
          await api.post(`/vehicles/${savedVehicle.id}/image`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });
        } catch (imgErr: any) {
          console.error("Image Upload Error:", imgErr.response?.data);
          setErrorMsg("Infos enregistrées, mais l'image a échoué (trop lourde ? > 2Mo).");
        }
      }

      setSuccessMsg("Véhicule mis à jour !");
      setTimeout(() => setSuccessMsg(""), 3000);
      setShowModal(false);
      fetchVehicles();
    } catch (err: any) {
      console.error("─── DEBUG SUBMIT ERROR ───");
      console.dir(err);
      
      let msg = "Erreur de validation.";
      const errorData = err.response?.data;
      
      if (errorData?.errors) {
        const firstField = Object.keys(errorData.errors)[0];
        msg = `${firstField}: ${errorData.errors[firstField][0]}`;
      } else if (errorData?.message) {
        msg = errorData.message;
      } else {
        msg = err.message;
      }
      
      setErrorMsg(`Détail: ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = useMemo(() => vehicles.filter(v => 
    v.brand.toLowerCase().includes(search.toLowerCase()) || 
    v.model.toLowerCase().includes(search.toLowerCase()) ||
    v.plate.toLowerCase().includes(search.toLowerCase())
  ), [vehicles, search]);

  const checkExpiry = (dateStr?: string) => {
    if (!dateStr) return false;
    const days = (new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
    return days < 30 && days >= 0;
  };

  const isExpired = (dateStr?: string) => {
    if (!dateStr) return false;
    return new Date(dateStr).getTime() < new Date().getTime();
  };

  if (checking) return null;

  return (
    <div className={styles.container}>
      {/* ── Luxury Header ── */}
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <p className={styles.subtitle}>Gestion d'Actifs</p>
          <h1 className={styles.title}>Showroom <span className="italic text-[#C5A059]">Privé</span></h1>
        </div>
        <div className="flex flex-col items-end gap-2">
          <AnimatePresence>
            {successMsg && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="bg-green-500 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                {successMsg}
              </motion.div>
            )}
            {errorMsg && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="bg-red-500 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>
          <button className={styles.addBtn} onClick={() => { setCurrentVehicle({ brand: "", model: "", plate: "", price_per_day: 0, year: 2024, fuel_type: "Diesel", horsepower: "", color: "Noir", type: "internal", status: "available" }); setShowModal(true); }}>
            <Plus size={18} strokeWidth={3} />
            Nouveau Véhicule
          </button>
        </div>
      </header>

      {/* ── Smart Toolbar ── */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={22} strokeWidth={1.5} />
          <input 
            type="text" placeholder="Rechercher par excellence, modèle ou plaque..." 
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.stats}>
          <strong>{filtered.length}</strong> modèles en inventaire
        </div>
      </div>

      {loading ? (
        <div className={styles.loader}>
          <div className={styles.spin} />
          <p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#C5A059]">Synchronisation de la flotte Royale...</p>
        </div>
      ) : (
        <div className={styles.showroomGrid}>
          <AnimatePresence mode="popLayout">
            {filtered.map((v, idx) => {
              const roi = (v.total_revenue || 0) - (v.total_maintenance_cost || 0);
              const isStar = roi > 50000; // Example threshold for "Star of the Fleet"
              
              return (
                <motion.div 
                  key={v.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className={styles.showroomCard}
                >
                  {/* Card Visual */}
                  <div className={styles.cardVisual}>
                    {v.image_url ? (
                      <img src={`http://localhost:8000${v.image_url}`} alt={v.model} />
                    ) : (
                      <div className="w-full h-full bg-[#FDFCFB] flex items-center justify-center text-[#F5E6D3]">
                        <Car size={80} strokeWidth={0.5} />
                      </div>
                    )}
                    
                    {/* Status Overlays */}
                    <div className={styles.statusOverlay}>
                      <span className={cn(styles.statusBadge, styles[`status_${v.status}`])}>
                        {v.status === 'available' ? 'Disponible' : v.status === 'rented' ? 'En Location' : 'Maintenance'}
                      </span>
                    </div>

                    {isStar && (
                      <div className={styles.starBadge}>
                        <Star size={12} fill="currentColor" />
                        Étoile de la Flotte
                      </div>
                    )}

                    <label className={styles.uploadOverlay}>
                       <input type="file" hidden onChange={e => handleImageUpload(e, v.id)} />
                       <Camera size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </label>
                  </div>

                  {/* Card Content */}
                  <div className={styles.cardContent}>
                    <div className={styles.cardHeader}>
                      <span className={styles.categoryTag}>{v.category || 'EXCELLENCE'}</span>
                      <h3 className={styles.vehicleName}>{v.brand} <span className="italic text-[#C5A059]">{v.model}</span></h3>
                      <div className={styles.plateInfo}>
                        <code>{v.plate}</code>
                        <span>•</span>
                        <span>{v.mileage || 0} KM</span>
                        <span>•</span>
                        <span>{v.year || '2024'}</span>
                      </div>
                    </div>

                    {/* New Luxury Specs Row */}
                    <div className="flex gap-4 mb-8">
                       <div className="flex items-center gap-2 bg-[#FDFCFB] px-4 py-2 rounded-xl border border-[#F5E6D3]">
                          <Fuel size={14} className="text-[#C5A059]" />
                          <span className="text-[10px] font-black uppercase text-[#1A1A1A]">{v.fuel_type || 'Diesel'}</span>
                       </div>
                       <div className="flex items-center gap-2 bg-[#FDFCFB] px-4 py-2 rounded-xl border border-[#F5E6D3]">
                          <TrendingUp size={14} className="text-[#C5A059]" />
                          <span className="text-[10px] font-black uppercase text-[#1A1A1A]">{v.horsepower || '190'} CV</span>
                       </div>
                       <div className="flex items-center gap-2 bg-[#FDFCFB] px-4 py-2 rounded-xl border border-[#F5E6D3]">
                          <div className="w-3 h-3 rounded-full border border-black/10" style={{ background: v.color || '#1A1A1A' }} />
                          <span className="text-[10px] font-black uppercase text-[#1A1A1A]">{v.color || 'Noir'}</span>
                       </div>
                    </div>

                    {/* Financial Metrics */}
                    <div className={styles.financials}>
                      <div className={styles.metric}>
                        <span className={styles.metricLabel}>Revenus Générés</span>
                        <span className={styles.metricValue}>{Number(v.total_revenue || 0).toLocaleString()} DH</span>
                      </div>
                      <div className={styles.metric}>
                        <span className={styles.metricLabel}>Net ROI</span>
                        <span className={cn(styles.metricValue, roi >= 0 ? styles.roiValue_positive : styles.roiValue_negative)}>
                           {roi.toLocaleString()} DH
                        </span>
                      </div>
                    </div>

                    {/* Expiry Alerts */}
                    <div className={styles.alertStrip}>
                       {(checkExpiry(v.insurance_date) || isExpired(v.insurance_date)) && (
                         <span className={cn(styles.expiryAlert, isExpired(v.insurance_date) ? styles.danger : styles.warning)}>
                            Assurance {isExpired(v.insurance_date) ? "Expirée" : "⚠️ Proche"}
                         </span>
                       )}
                       {(checkExpiry(v.tech_inspection_date) || isExpired(v.tech_inspection_date)) && (
                         <span className={cn(styles.expiryAlert, isExpired(v.tech_inspection_date) ? styles.danger : styles.warning)}>
                            V. Tech {isExpired(v.tech_inspection_date) ? "Expirée" : "⚠️ Proche"}
                         </span>
                       )}
                    </div>

                    {/* Card Actions */}
                    <div className={styles.cardActions}>
                       <button className={styles.actionBtn} onClick={() => { setCurrentVehicle(v); fetchMaintenances(v.id); }}>
                          <History size={16} />
                          Historique
                       </button>
                       <button className={styles.actionBtn} onClick={() => handleEdit(v)}>
                          <Edit size={16} />
                          Editer
                       </button>
                       <button 
                         className={cn(styles.actionBtn, styles.deleteBtn)} 
                         onClick={() => handleDelete(v.id)}
                         disabled={deletingId === v.id}
                       >
                         {deletingId === v.id ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                       </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Modal Ajout/Edition */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>{currentVehicle?.id ? "Raffiner le véhicule" : "Nouvel Actif"}</h3>
              <button onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow} style={{ gridTemplateColumns: '1fr' }}>
                <div className={styles.inputGroup}>
                   <label>Image Principale (Mise en avant)</label>
                   <div className="flex items-center gap-6 p-6 bg-[#FDFCFB] rounded-[30px] border border-[#F5E6D3]">
                      <div className="w-40 h-24 rounded-2xl overflow-hidden border border-[#F5E6D3] bg-white">
                        <img 
                          src={currentVehicle.new_image ? URL.createObjectURL(currentVehicle.new_image) : (currentVehicle.image_url ? `http://localhost:8000${currentVehicle.image_url}` : '')} 
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
                            if (file) setCurrentVehicle({ ...currentVehicle, new_image: file });
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
                    {currentVehicle?.photos?.map((url: string, i: number) => (
                      <div key={i} className={styles.galleryItem}>
                        <img src={`http://localhost:8000${url}`} alt="Gallery" />
                        <button 
                          type="button" 
                          className={styles.removePhoto}
                          onClick={() => {
                            const newPhotos = [...currentVehicle.photos];
                            newPhotos.splice(i, 1);
                            setCurrentVehicle({ ...currentVehicle, photos: newPhotos });
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
                          
                          if (currentVehicle.id) {
                            // If vehicle exists, upload immediately
                            const formData = new FormData();
                            Array.from(files).forEach(f => formData.append("photos[]", f));
                            try {
                              const res = await api.post(`/vehicles/${currentVehicle.id}/photos`, formData, {
                                headers: { "Content-Type": "multipart/form-data" }
                              });
                              setCurrentVehicle({ ...currentVehicle, photos: res.data.photos });
                            } catch (err) { alert("Erreur upload photos"); }
                          } else {
                            // If new vehicle, just show names or keep in state (simplified for now: upload only on existing)
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
                  <input required type="text" value={currentVehicle.brand} onChange={e => setCurrentVehicle({...currentVehicle, brand: e.target.value})} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Modèle</label>
                  <input required type="text" value={currentVehicle.model} onChange={e => setCurrentVehicle({...currentVehicle, model: e.target.value})} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Plaque d'immatriculation</label>
                  <input required type="text" value={currentVehicle.plate} onChange={e => setCurrentVehicle({...currentVehicle, plate: e.target.value})} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Prix par jour (DH)</label>
                  <input required type="number" value={currentVehicle.price_per_day} onChange={e => setCurrentVehicle({...currentVehicle, price_per_day: e.target.value})} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Kilométrage</label>
                  <input type="number" value={currentVehicle.mileage || ""} onChange={e => setCurrentVehicle({...currentVehicle, mileage: e.target.value})} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Année</label>
                  <input type="number" value={currentVehicle.year || ""} onChange={e => setCurrentVehicle({...currentVehicle, year: e.target.value})} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Carburant</label>
                  <select value={currentVehicle.fuel_type || "Diesel"} onChange={e => setCurrentVehicle({...currentVehicle, fuel_type: e.target.value})}>
                    <option value="Diesel">Diesel</option>
                    <option value="Essence">Essence</option>
                    <option value="Hybride">Hybride</option>
                    <option value="Electrique">Electrique</option>
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label>Puissance (CV)</label>
                  <input type="text" value={currentVehicle.horsepower || ""} onChange={e => setCurrentVehicle({...currentVehicle, horsepower: e.target.value})} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Couleur</label>
                  <input type="text" value={currentVehicle.color || ""} onChange={e => setCurrentVehicle({...currentVehicle, color: e.target.value})} placeholder="Ex: Noir Profond" />
                </div>
                <div className={styles.inputGroup}>
                  <label>Expiration Assurance</label>
                  <input type="date" value={currentVehicle.insurance_date || ""} onChange={e => setCurrentVehicle({...currentVehicle, insurance_date: e.target.value})} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Type de Gestion</label>
                  <select value={currentVehicle.type} onChange={e => setCurrentVehicle({...currentVehicle, type: e.target.value})}>
                    <option value="internal">Interne (Agence)</option>
                    <option value="collaborator">Partenaire (Collaborateur)</option>
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label>Catégorie</label>
                  <select value={currentVehicle.category || "standard"} onChange={e => handleCategoryChange(e.target.value)}>
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
                 <select value={currentVehicle.status} onChange={e => setCurrentVehicle({...currentVehicle, status: e.target.value})}>
                    <option value="available">Disponible</option>
                    <option value="maintenance">En Maintenance</option>
                    <option value="rented">Déjà Loué</option>
                  </select>
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
      )}

      {/* Modal Maintenance */}
      {showMaintenanceModal && (
        <div className={styles.modalOverlay}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={styles.modal}>
            <div className={styles.modalHeader}>
              <div className="flex items-center gap-4">
                <Wrench className="text-[#C5A059]" size={28} />
                <h3>Journal : {currentVehicle?.brand} {currentVehicle?.model}</h3>
              </div>
              <button onClick={() => setShowMaintenanceModal(false)}><X size={24} /></button>
            </div>

            <div className={styles.maintenanceBody}>
              <div className={styles.quickForm}>
                <h4>Nouvelle Intervention</h4>
                <div className={styles.formRow}>
                   <div className={styles.inputGroup}>
                      <label>Type</label>
                      <input type="text" placeholder="ex: Vidange Premium" id="m_type" />
                   </div>
                   <div className={styles.inputGroup}>
                      <label>Coût (DH)</label>
                      <input type="number" id="m_cost" />
                   </div>
                </div>
                <div className={styles.inputGroup} style={{ marginTop: '1rem' }}>
                   <label>Description</label>
                   <textarea id="m_desc" rows={3}></textarea>
                </div>
                <button className={styles.submitBtn} style={{ marginTop: '2rem' }} onClick={async () => {
                  const t = (document.getElementById('m_type') as HTMLInputElement).value;
                  const c = (document.getElementById('m_cost') as HTMLInputElement).value;
                  const d = (document.getElementById('m_desc') as HTMLTextAreaElement).value;
                  if (!t || !c) return;
                  try {
                    await api.post('/maintenances', {
                      vehicle_id: currentVehicle.id,
                      type: t,
                      cost: c,
                      maintenance_date: new Date().toISOString().split('T')[0],
                      description: d,
                    });
                    fetchMaintenances(currentVehicle.id);
                    fetchVehicles();
                  } catch (err) { alert("Erreur."); }
                }}>
                  Enregistrer l'Intervention
                </button>
              </div>

              <div className={styles.historyList}>
                <h4>Historique des Soins</h4>
                {maintenances.length === 0 ? <p className="italic text-[#8C8C8C] text-center py-10">Aucun historique enregistré.</p> : (
                  <div className={styles.timeline}>
                    {maintenances.map((m, i) => (
                      <div key={i} className={styles.timelineItem}>
                        <div className={styles.timelineDot}></div>
                        <div className={styles.timelineContent}>
                          <div className={styles.mHeader}>
                            <strong>{m.type}</strong>
                            <span>{m.cost} DH</span>
                          </div>
                          <p className="text-sm text-[#8C8C8C] mb-2">{m.description}</p>
                          <small className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]">{m.maintenance_date}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
