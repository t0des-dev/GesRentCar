"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useAgency } from "@/hooks/useAgency";
import { 
  Car, Plus, Edit, Trash2, Search, 
  Settings, AlertTriangle, CheckCircle,
  Loader2, Filter, X, Camera, Wrench, History
} from "lucide-react";
import styles from "./page.module.css";
import api from "@/lib/api/client";

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

  const handleCategoryChange = (cat: string) => {
    const basePrice = agency.category_prices?.[cat] || 350;
    setCurrentVehicle({
      ...currentVehicle, 
      category: cat,
      price_per_day: currentVehicle.id ? currentVehicle.price_per_day : basePrice
    });
  };

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/vehicles');
      const data = res.data;
      setVehicles(Array.isArray(data) ? data : data.data ?? []);
    } catch {
      alert("Erreur de chargement.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, vehicleId: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      await api.post(`/vehicles/${vehicleId}/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      fetchVehicles();
    } catch {
      alert("Erreur upload");
    }
  };

  const fetchMaintenances = async (vehicleId: number) => {
    try {
      const res = await api.get(`/maintenances?vehicle_id=${vehicleId}`);
      setMaintenances(res.data);
      setShowMaintenanceModal(true);
    } catch {
      alert("Erreur lors de la récupération de la maintenance.");
    }
  };

  useEffect(() => { if (!checking && user) fetchVehicles(); }, [fetchVehicles, checking, user]);

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce véhicule définitivement ?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/vehicles/${id}`);
      fetchVehicles();
    } catch {
      alert("Erreur lors de la suppression.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    
    try {
      let savedVehicle;
      if (currentVehicle?.id) {
        const res = await api.put(`/vehicles/${currentVehicle.id}`, currentVehicle);
        savedVehicle = res.data;
      } else {
        const res = await api.post(`/vehicles`, currentVehicle);
        savedVehicle = res.data;
      }

      if (currentVehicle.new_image) {
        const formData = new FormData();
        formData.append("image", currentVehicle.new_image);
        await api.post(`/vehicles/${savedVehicle.id}/image`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      setShowModal(false);
      fetchVehicles();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Erreur lors de la sauvegarde.");
    } finally {
      setSubmitting(false);
    }
  };

  if (checking) return null;

  const filtered = vehicles.filter(v => 
    v.brand.toLowerCase().includes(search.toLowerCase()) || 
    v.model.toLowerCase().includes(search.toLowerCase()) ||
    v.plate.toLowerCase().includes(search.toLowerCase())
  );

  const checkExpiry = (dateStr?: string) => {
    if (!dateStr) return false;
    const days = (new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
    return days < 30 && days >= 0; // Expires in less than 30 days
  };

  const isExpired = (dateStr?: string) => {
    if (!dateStr) return false;
    return new Date(dateStr).getTime() < new Date().getTime(); // Already expired
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestion de la Flotte</h1>
          <p className={styles.subtitle}>Gérez votre inventaire de véhicules et leurs statuts.</p>
        </div>
        <button className={styles.addBtn} onClick={() => { setCurrentVehicle({ brand: "", model: "", plate: "", price_per_day: 0, type: "internal", status: "available" }); setShowModal(true); }}>
          <Plus size={20} />
          Ajouter un véhicule
        </button>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={18} />
          <input 
            type="text" placeholder="Rechercher par marque, modèle ou plaque..." 
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.stats}>
          <strong>{filtered.length}</strong> véhicules trouvés
        </div>
      </div>

      {loading ? (
        <div className={styles.loader}>
          <Loader2 className={styles.spin} size={32} />
          <p className="ml-4 font-black uppercase tracking-widest text-xs">Synchronisation de la flotte...</p>
        </div>
      ) : (
        <>
          {/* ── Desktop View (Table) ── */}
          <div className={styles.desktopOnly}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Véhicule</th>
                  <th>Plaque</th>
                  <th>Type</th>
                  <th>Statut</th>
                  <th>ROI & Admin</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(v => (
                  <tr key={v.id}>
                    <td>
                      <div className={styles.vehicleCell}>
                        <div className={styles.imgWrapper}>
                          {v.image_url ? (
                            <img src={`http://localhost:8000${v.image_url}`} alt={v.model} />
                          ) : (
                            <div className={styles.imgPlaceholder}><Camera size={14} /></div>
                          )}
                          <label className={styles.uploadOverlay}>
                            <input type="file" hidden onChange={e => handleImageUpload(e, v.id)} />
                            <Edit size={12} />
                          </label>
                        </div>
                        <div className={styles.vehicleInfo}>
                          <span className={styles.brand}>{v.brand}</span>
                          <span className={styles.model}>
                            {v.model} 
                            <span className="text-[10px] font-bold text-slate-400 ml-2 px-2 py-0.5 bg-slate-100 rounded-full">
                              {v.category?.toUpperCase() || 'STANDARD'}
                            </span>
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <code className={styles.plate}>{v.plate}</code>
                        <span className="text-[11px] font-black text-slate-400 mt-1">{v.mileage || 0} KM</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1">
                        <span className={v.type === 'internal' ? styles.badgeInternal : styles.badgePartner}>
                          {v.type === 'internal' ? "Interne" : "Partenaire"}
                        </span>
                        <div className="text-[11px] font-bold text-slate-500 mt-1 whitespace-nowrap">
                          Prix: {v.dynamic_price && v.dynamic_price !== v.price_per_day ? (
                            <span title={v.dynamic_reason} className="text-destructive">{v.dynamic_price} DH <span className="line-through text-slate-400">{v.price_per_day}</span></span>
                          ) : (
                            <span>{v.price_per_day} DH</span>
                          )} /J
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.status} ${styles[v.status]}`}>
                        {v.status === 'available' ? 'Disponible' : v.status === 'rented' ? 'En Location' : 'Maintenance'}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1 text-xs min-w-[120px]">
                        <div className="flex justify-between w-full">
                          <span className="text-slate-500 font-medium">Revenus:</span>
                          <span className="font-black text-emerald-600">{Number(v.total_revenue || 0).toLocaleString('fr-FR')} DH</span>
                        </div>
                        <div className="flex justify-between w-full">
                          <span className="text-slate-500 font-medium">Maint.:</span>
                          <span className="font-black text-red-500">-{Number(v.total_maintenance_cost || 0).toLocaleString('fr-FR')} DH</span>
                        </div>
                        <div className="flex justify-between w-full border-t border-slate-100 mt-1 pt-1">
                          <span className="text-slate-500 font-medium">ROI:</span>
                          <span className={`font-black ${(v.total_revenue || 0) - (v.total_maintenance_cost || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {(v.total_revenue || 0) - (v.total_maintenance_cost || 0)} DH
                          </span>
                        </div>
                        {/* Admin Alerts */}
                        <div className="mt-1 flex gap-1 flex-wrap">
                           {checkExpiry(v.insurance_date) && <span title="Assurance expire bientôt" className="bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded text-[9px] font-black uppercase">Assur ⚠️</span>}
                           {isExpired(v.insurance_date) && <span title="Assurance expirée !" className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded text-[9px] font-black uppercase">Assur ❌</span>}
                           
                           {checkExpiry(v.tech_inspection_date) && <span title="Visite Tech. expire bientôt" className="bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded text-[9px] font-black uppercase">V.Tech ⚠️</span>}
                           {isExpired(v.tech_inspection_date) && <span title="Visite Tech. expirée !" className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded text-[9px] font-black uppercase">V.Tech ❌</span>}
                        </div>
                      </div>
                    </td>
                    <td className={styles.actions}>
                      <button className={styles.historyBtn} onClick={() => { setCurrentVehicle(v); fetchMaintenances(v.id); }} title="Historique Maintenance"><History size={16} /></button>
                      <button className={styles.editBtn} onClick={() => { setCurrentVehicle(v); setShowModal(true); }}><Edit size={16} /></button>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(v.id)} disabled={deletingId === v.id}>
                        {deletingId === v.id ? <Loader2 className={styles.spinIcon} size={16} /> : <Trash2 size={16} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Mobile View (Cards) ── */}
          <div className={styles.mobileGrid}>
            {filtered.map(v => (
              <div key={v.id} className={styles.mobileCard}>
                <div className={styles.cardHeader}>
                  <img src={v.image_url ? `http://localhost:8000${v.image_url}` : "/car-placeholder.png"} className={styles.cardImg} alt={v.brand} />
                  <div className={styles.cardTitle}>
                    <h3>{v.brand} {v.model}</h3>
                    <p>{v.category || 'Standard'}</p>
                  </div>
                  <div className="ml-auto">
                    <span className={`${styles.status} ${styles[v.status]}`}>
                      {v.status === 'available' ? 'Dispo' : v.status}
                    </span>
                  </div>
                </div>

                <div className={styles.cardInfo}>
                  <span className={styles.cardPlate}>{v.plate}</span>
                  {v.dynamic_price && v.dynamic_price !== v.price_per_day ? (
                    <span className={styles.cardPrice} title={v.dynamic_reason}>
                      <span className="line-through text-xs text-muted-foreground mr-1">{v.price_per_day}</span>
                      <span className="text-destructive">{v.dynamic_price} DH</span>
                      <small className="text-[10px] text-slate-400 font-black ml-1">/J</small>
                    </span>
                  ) : (
                    <span className={styles.cardPrice}>{v.price_per_day} DH<small className="text-[10px] text-slate-400 font-black ml-1">/J</small></span>
                  )}
                </div>

                <div className="px-4 py-3 bg-slate-50 border-t border-b border-slate-100 flex justify-between items-center text-xs">
                   <div className="flex flex-col">
                     <span className="text-slate-400 font-semibold mb-0.5">Kilométrage</span>
                     <span className="font-black text-slate-700">{v.mileage || 0} KM</span>
                   </div>
                   <div className="flex flex-col items-end">
                     <span className="text-slate-400 font-semibold mb-0.5">ROI Total</span>
                     <span className={`font-black ${(v.total_revenue || 0) - (v.total_maintenance_cost || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {(v.total_revenue || 0) - (v.total_maintenance_cost || 0)} DH
                     </span>
                   </div>
                </div>

                {/* Admin Mobile Alerts */}
                {(checkExpiry(v.insurance_date) || isExpired(v.insurance_date) || checkExpiry(v.tech_inspection_date) || isExpired(v.tech_inspection_date)) && (
                  <div className="px-4 pb-2 flex gap-1 flex-wrap">
                     {checkExpiry(v.insurance_date) && <span title="Assurance expire bientôt" className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-[10px] font-black uppercase">Assurance ⚠️</span>}
                     {isExpired(v.insurance_date) && <span title="Assurance expirée !" className="bg-red-100 text-red-600 px-2 py-1 rounded text-[10px] font-black uppercase">Assurance ❌</span>}
                     {checkExpiry(v.tech_inspection_date) && <span title="Visite Tech. expire bientôt" className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-[10px] font-black uppercase">Visite Tech. ⚠️</span>}
                     {isExpired(v.tech_inspection_date) && <span title="Visite Tech. expirée !" className="bg-red-100 text-red-600 px-2 py-1 rounded text-[10px] font-black uppercase">Visite Tech. ❌</span>}
                  </div>
                )}

                <div className={styles.cardActions}>
                   <button onClick={() => { setCurrentVehicle(v); fetchMaintenances(v.id); }}>
                    <History size={18} />
                  </button>
                  <button onClick={() => { setCurrentVehicle(v); setShowModal(true); }}>
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(v.id)} className={styles.deleteBtnMobile} disabled={deletingId === v.id}>
                    {deletingId === v.id ? <Loader2 className={styles.spinIcon} size={18} /> : <Trash2 size={18} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal Ajout/Edition */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>{currentVehicle?.id ? "Modifier le véhicule" : "Ajouter un véhicule"}</h3>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            
            {errorMsg && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl mb-6 flex items-center gap-3">
                <AlertTriangle size={18} />
                <p className="text-sm font-medium">{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              
              <div className={styles.formRow}>
                <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
                  <label>Photo du véhicule</label>
                  <div className="flex items-center gap-4">
                    {currentVehicle?.image_url && !currentVehicle.new_image && (
                      <img src={`http://localhost:8000${currentVehicle.image_url}`} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-border" />
                    )}
                    {currentVehicle.new_image && (
                      <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                        <CheckCircle size={20} />
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={e => setCurrentVehicle({...currentVehicle, new_image: e.target.files?.[0]})} 
                      className="text-sm flex-1"
                    />
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
                  <input type="number" value={currentVehicle.mileage || ""} onChange={e => setCurrentVehicle({...currentVehicle, mileage: e.target.value})} placeholder="Ex: 150000" />
                </div>
                <div className={styles.inputGroup}>
                  <label>Expiration Assurance</label>
                  <input type="date" value={currentVehicle.insurance_date || ""} onChange={e => setCurrentVehicle({...currentVehicle, insurance_date: e.target.value})} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Visite Technique (Exp)</label>
                  <input type="date" value={currentVehicle.tech_inspection_date || ""} onChange={e => setCurrentVehicle({...currentVehicle, tech_inspection_date: e.target.value})} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Vignette (Exp)</label>
                  <input type="date" value={currentVehicle.vignette_date || ""} onChange={e => setCurrentVehicle({...currentVehicle, vignette_date: e.target.value})} />
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
              {currentVehicle.type === 'collaborator' && (
                <div className={styles.formRow}>
                  <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
                    <label>Taux de Commission Partenaire (%)</label>
                    <input type="number" step="0.5" value={currentVehicle.commission_rate || ""} onChange={e => setCurrentVehicle({...currentVehicle, commission_rate: e.target.value ? parseFloat(e.target.value) : null})} placeholder="Ex: 15" />
                  </div>
                </div>
              )}
              <div className={styles.formRow}>
                <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
                  <label>Statut</label>
                  <select value={currentVehicle.status} onChange={e => setCurrentVehicle({...currentVehicle, status: e.target.value})}>
                    <option value="available">Disponible</option>
                    <option value="maintenance">En Maintenance</option>
                    <option value="rented">Déjà Loué</option>
                  </select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
                  <label>Description (Français)</label>
                  <textarea value={currentVehicle.description_fr || ""} onChange={e => setCurrentVehicle({...currentVehicle, description_fr: e.target.value})} rows={2} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
                  <label>Description (English)</label>
                  <textarea value={currentVehicle.description_en || ""} onChange={e => setCurrentVehicle({...currentVehicle, description_en: e.target.value})} rows={2} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
                  <label>الوصف (العربية)</label>
                  <textarea dir="rtl" value={currentVehicle.description_ar || ""} onChange={e => setCurrentVehicle({...currentVehicle, description_ar: e.target.value})} rows={2} />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button type="button" className="flex-1 py-3 rounded-2xl border border-border bg-card text-foreground font-semibold hover:bg-muted transition-colors" onClick={() => setShowModal(false)}>
                  Annuler
                </button>
                <button type="submit" className={styles.submitBtn} disabled={submitting}>
                  {submitting ? <Loader2 className={styles.spinIcon} size={18} /> : <CheckCircle size={18} />}
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal Maintenance */}
      {showMaintenanceModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} style={{ maxWidth: '700px' }}>
            <div className={styles.modalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Wrench size={20} color="#6366f1" />
                <h3>Journal de Maintenance : {currentVehicle?.brand} {currentVehicle?.model}</h3>
              </div>
              <button onClick={() => setShowMaintenanceModal(false)}><X size={20} /></button>
            </div>

            <div className={styles.maintenanceBody}>
              {/* Formulaire rapide */}
              <div className={styles.quickForm}>
                <h4>Nouvelle Intervention</h4>
                <div className={styles.formRow}>
                   <input type="text" placeholder="Type (ex: Vidange)" id="m_type" />
                   <input type="number" placeholder="Coût (DH)" id="m_cost" />
                   <input type="date" defaultValue={new Date().toISOString().split('T')[0]} id="m_date" />
                </div>
                <textarea placeholder="Description de l'intervention..." id="m_desc"></textarea>
                <button className={styles.saveBtnSmall} onClick={async () => {
                  try {
                    await api.post('/maintenances', {
                      vehicle_id: currentVehicle.id,
                      type: (document.getElementById('m_type') as HTMLInputElement).value,
                      cost: (document.getElementById('m_cost') as HTMLInputElement).value,
                      maintenance_date: (document.getElementById('m_date') as HTMLInputElement).value,
                      description: (document.getElementById('m_desc') as HTMLTextAreaElement).value,
                    });
                    fetchMaintenances(currentVehicle.id);
                    fetchVehicles();
                    // Clear inputs
                    (document.getElementById('m_type') as HTMLInputElement).value = '';
                    (document.getElementById('m_cost') as HTMLInputElement).value = '';
                    (document.getElementById('m_desc') as HTMLTextAreaElement).value = '';
                  } catch (err: any) {
                    alert(err.response?.data?.message || "Erreur.");
                  }
                }}>
                  Enregistrer l'intervention
                </button>
              </div>

              {/* Liste */}
              <div className={styles.historyList}>
                <h4>Historique</h4>
                {maintenances.length === 0 ? <p className={styles.empty}>Aucun historique enregistré.</p> : (
                  <div className={styles.timeline}>
                    {maintenances.map((m, i) => (
                      <div key={i} className={styles.timelineItem}>
                        <div className={styles.timelineDot}></div>
                        <div className={styles.timelineContent}>
                          <div className={styles.mHeader}>
                            <strong>{m.type}</strong>
                            <span>{m.cost} DH</span>
                          </div>
                          <p>{m.description}</p>
                          <small>{m.maintenance_date}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
