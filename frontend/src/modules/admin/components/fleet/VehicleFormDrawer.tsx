"use client";

import { motion } from "framer-motion";
import { X, Loader2, CheckCircle, Plus, Globe, Car, Info, Settings, Calendar, ShieldCheck } from "lucide-react";
import { Vehicle } from "@/types/admin";
import api from "@/shared/services/client";
import { getImageUrl } from "@/shared/utils/image";
import { useState } from "react";

interface VehicleFormDrawerProps {
  vehicle: any;
  setVehicle: (v: any) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  categoryPrices: Record<string, number>;
}

export default function VehicleFormDrawer({
  vehicle,
  setVehicle,
  onClose,
  onSubmit,
  submitting,
  categoryPrices
}: VehicleFormDrawerProps) {

  const [activeTab, setActiveTab] = useState("general");

  const handleCategoryChange = (cat: string) => {
    const basePrice = categoryPrices[cat] || 350;
    setVehicle({
      ...vehicle,
      category: cat,
      price_per_day: vehicle.id ? vehicle.price_per_day : basePrice
    });
  };

  const tabs = [
    { id: "general", label: "Informations", icon: Info },
    { id: "images", label: "Galerie", icon: Car },
    { id: "admin", label: "Administration", icon: ShieldCheck },
    { id: "seo", label: "SEO & Partage", icon: Globe },
  ];

  return (
    <>
      {/* Overlay */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]" 
      />

      {/* Drawer */}
      <motion.div 
        initial={{ x: "100%" }} 
        animate={{ x: 0 }} 
        exit={{ x: "100%" }} 
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 right-0 w-full md:w-[600px] xl:w-[700px] bg-white shadow-2xl z-[101] flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">{vehicle?.id ? "Modifier l'actif" : "Nouvel Actif"}</h3>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">{vehicle?.brand} {vehicle?.model}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 transition-colors rounded-xl">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 border-b border-slate-100 bg-slate-50/50">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700"}`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="vehicle-form" onSubmit={onSubmit} className="space-y-8">
            
            {activeTab === "general" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Marque</label>
                    <input required type="text" className="input-premium bg-slate-50 border-slate-200 focus:bg-white" value={vehicle.brand} onChange={e => setVehicle({...vehicle, brand: e.target.value})} placeholder="Ex: Mercedes-Benz" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Modèle</label>
                    <input required type="text" className="input-premium bg-slate-50 border-slate-200 focus:bg-white" value={vehicle.model} onChange={e => setVehicle({...vehicle, model: e.target.value})} placeholder="Ex: Classe S" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Catégorie</label>
                    <select className="input-premium bg-slate-50 border-slate-200 focus:bg-white" value={vehicle.category || "standard"} onChange={e => handleCategoryChange(e.target.value)}>
                      <option value="eco">Économique</option>
                      <option value="standard">Standard</option>
                      <option value="suv">SUV / 4x4</option>
                      <option value="luxury">Luxe / Prestige</option>
                      <option value="sport">Sport / Cabriolet</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Prix par jour (DH)</label>
                    <input required type="number" className="input-premium bg-slate-50 border-slate-200 focus:bg-white text-lg font-black text-primary" value={vehicle.price_per_day} onChange={e => setVehicle({...vehicle, price_per_day: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Carburant</label>
                    <select className="input-premium bg-slate-50 border-slate-200 focus:bg-white" value={vehicle.fuel_type || "Diesel"} onChange={e => setVehicle({...vehicle, fuel_type: e.target.value})}>
                      <option value="Diesel">Diesel</option>
                      <option value="Essence">Essence</option>
                      <option value="Hybride">Hybride</option>
                      <option value="Electrique">Electrique</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Boîte / Puissance</label>
                    <input type="text" className="input-premium bg-slate-50 border-slate-200 focus:bg-white" value={vehicle.horsepower || ""} onChange={e => setVehicle({...vehicle, horsepower: e.target.value})} placeholder="Ex: Auto / 250 CV" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Année</label>
                    <input type="number" className="input-premium bg-slate-50 border-slate-200 focus:bg-white" value={vehicle.year || ""} onChange={e => setVehicle({...vehicle, year: e.target.value})} placeholder="Ex: 2024" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Couleur</label>
                    <input type="text" className="input-premium bg-slate-50 border-slate-200 focus:bg-white" value={vehicle.color || ""} onChange={e => setVehicle({...vehicle, color: e.target.value})} placeholder="Ex: Noir Obsidienne" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "images" && (
              <div className="space-y-8">
                <div className="flex flex-col gap-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Image Principale (Cover)</label>
                   <div className="flex flex-col items-center gap-4 p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                      <div className="w-full aspect-video rounded-xl overflow-hidden border border-slate-200 bg-white relative group">
                        <img
                          src={vehicle.new_image ? URL.createObjectURL(vehicle.new_image) : (vehicle.image_url ? getImageUrl(vehicle.image_url) || 'https://placehold.co/800x450?text=Aucune+Image' : 'https://placehold.co/800x450?text=Aucune+Image')}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          alt="Main"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <button type="button" onClick={() => document.getElementById('main_image')?.click()} className="btn-primary shadow-xl">
                              Remplacer
                           </button>
                        </div>
                      </div>
                      <input
                        type="file"
                        id="main_image"
                        hidden
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setVehicle({ ...vehicle, new_image: file });
                        }}
                      />
                   </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Galerie Complète</label>
                  <div className="grid grid-cols-3 gap-3">
                    {vehicle?.photos?.map((url: string, i: number) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                        <img src={getImageUrl(url) || url} alt="Gallery" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-lg flex items-center justify-center cursor-pointer transition-transform opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 hover:bg-red-600 shadow-md"
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
                    <label className="aspect-square border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary hover:bg-primary/5 hover:text-primary transition-all text-slate-400 group">
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
                            alert("Veuillez d'abord sauvegarder le véhicule avant d'ajouter une galerie.");
                          }
                        }}
                      />
                      <Plus size={24} className="group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Ajouter</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "admin" && (
              <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2"><Calendar size={12} /> Immatriculation</label>
                    <input required type="text" className="input-premium bg-slate-50 border-slate-200 focus:bg-white font-mono uppercase font-bold text-slate-900" value={vehicle.plate} onChange={e => setVehicle({...vehicle, plate: e.target.value})} placeholder="12345 | A | 1" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Kilométrage (KM)</label>
                    <input type="number" className="input-premium bg-slate-50 border-slate-200 focus:bg-white font-mono" value={vehicle.mileage || ""} onChange={e => setVehicle({...vehicle, mileage: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Statut</label>
                    <select className="input-premium bg-slate-50 border-slate-200 focus:bg-white font-bold" value={vehicle.status} onChange={e => setVehicle({...vehicle, status: e.target.value})}>
                      <option value="available" className="text-emerald-600">🟢 Disponible</option>
                      <option value="rented" className="text-blue-600">🔵 En Location</option>
                      <option value="maintenance" className="text-amber-600">🟠 En Maintenance</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Appartenance</label>
                    <select className="input-premium bg-slate-50 border-slate-200 focus:bg-white" value={vehicle.type} onChange={e => setVehicle({...vehicle, type: e.target.value})}>
                      <option value="internal">Flotte Interne (Vectoria)</option>
                      <option value="collaborator">Partenaire / Investisseur</option>
                    </select>
                  </div>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 mb-4">
                     <ShieldCheck size={16} className="text-primary" /> Validité Papiers
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Assurance</label>
                      <input type="date" className="input-premium bg-white border-slate-200 h-10 px-3 text-xs" value={vehicle.insurance_date || ""} onChange={e => setVehicle({...vehicle, insurance_date: e.target.value})} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Visite Tech.</label>
                      <input type="date" className="input-premium bg-white border-slate-200 h-10 px-3 text-xs" value={vehicle.tech_inspection_date || ""} onChange={e => setVehicle({...vehicle, tech_inspection_date: e.target.value})} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Vignette</label>
                      <input type="date" className="input-premium bg-white border-slate-200 h-10 px-3 text-xs" value={vehicle.vignette_date || ""} onChange={e => setVehicle({...vehicle, vignette_date: e.target.value})} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "seo" && (
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Meta Titre (SEO)</label>
                  <input type="text" className="input-premium bg-slate-50 border-slate-200 focus:bg-white" value={vehicle.seo_title || ""} onChange={e => setVehicle({...vehicle, seo_title: e.target.value})} placeholder="Ex: Louez la Mercedes Classe S à Marrakech | Vectoria" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Meta Description</label>
                  <textarea className="input-premium bg-slate-50 border-slate-200 focus:bg-white min-h-[100px] py-3" value={vehicle.seo_description || ""} onChange={e => setVehicle({...vehicle, seo_description: e.target.value})} placeholder="Ex: Profitez du luxe ultime avec notre Mercedes Classe S..." />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">URL Image (WhatsApp / Facebook)</label>
                  <input type="text" className="input-premium bg-slate-50 border-slate-200 focus:bg-white" value={vehicle.og_image_url || ""} onChange={e => setVehicle({...vehicle, og_image_url: e.target.value})} placeholder="Lien direct vers l'image OpenGraph" />
                  <p className="text-[10px] text-slate-400">Si laissé vide, la plateforme utilisera l'image principale automatiquement.</p>
                </div>
              </div>
            )}

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-white mt-auto">
          <div className="flex items-center justify-end gap-3">
             <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-50 transition-colors">
               Annuler
             </button>
             <button
               type="submit"
               form="vehicle-form"
               disabled={submitting}
               className="btn-primary shadow-xl shadow-primary/20 flex items-center gap-2"
             >
               {submitting ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
               {vehicle.id ? "Enregistrer les modifications" : "Créer le véhicule"}
             </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
