"use client";

import { useState, useEffect } from "react";
import { useAgency } from "@/hooks/useAgency";
import { 
  Save, Palette, Type, Image as ImageIcon, Loader2, Plus, Trash2, 
  Tag, TrendingUp, Layout, Menu, Phone, Globe, MousePointer2, 
  Layers, Smartphone, Monitor, CheckCircle2, Sliders, Settings,
  Hash, Share2
} from "lucide-react";
import api from "@/lib/api/client";
import styles from "./StorefrontManager.module.css";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface SpecialOffer {
  category: string;
  discount: number;
  end_date: string;
  active: boolean;
}

interface NavLink {
  label: string;
  url: string;
}

export default function StorefrontManager() {
  const currentAgency = useAgency();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("global");
  const [stats, setStats] = useState<any[]>([]);
  
  const [form, setForm] = useState({
    name: "",
    slogan: "",
    primary_color: "#6366f1",
    hero_image_url: "",
    about_text_fr: "",
    about_text_en: "",
    about_text_ar: "",
    sections_config: {
      featured: true,
      stats: true,
      why_us: true,
      testimonials: true,
      map: true
    },
    category_prices: {
      eco: 250,
      standard: 350,
      suv: 600,
      luxury: 1200,
      sport: 1000
    },
    special_offers: [] as SpecialOffer[],
    header_config: {
      sticky: true,
      transparent_hero: true,
      menu_links: [] as NavLink[]
    },
    footer_config: {
      address: "",
      phone: "",
      email: "",
      social_links: {
        facebook: "",
        instagram: "",
        whatsapp: ""
      }
    },
    theme_config: {
      border_radius: "24px",
      button_style: "pill",
      glassmorphism: true,
      font_family: "Inter"
    },
    stats_config: {
      label_1: "Clients satisfaits", value_1: "2,400+",
      label_2: "Véhicules premium", value_2: "80+",
      label_3: "Années d'expérience", value_3: "15",
      label_4: "Support disponible", value_4: "24/7"
    }
  });

  useEffect(() => {
    if (currentAgency.agency_name) {
      setForm({
        name: currentAgency.agency_name,
        slogan: currentAgency.agency_slogan,
        primary_color: currentAgency.primary_color,
        hero_image_url: currentAgency.hero_image_url || "",
        about_text_fr: currentAgency.about_text_fr || "",
        about_text_en: currentAgency.about_text_en || "",
        about_text_ar: currentAgency.about_text_ar || "",
        sections_config: { ...form.sections_config, ...currentAgency.sections_config },
        category_prices: currentAgency.category_prices || form.category_prices,
        special_offers: (currentAgency.special_offers as SpecialOffer[]) || [],
        header_config: { ...form.header_config, ...currentAgency.header_config },
        footer_config: { ...form.footer_config, ...(currentAgency.footer_config as any) },
        theme_config: { ...form.theme_config, ...(currentAgency.theme_config as any) },
        stats_config: { ...form.stats_config, ...(currentAgency.stats_config as any) }
      });
    }
  }, [currentAgency]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/stats/revenue");
        setStats(res.data);
      } catch (err) { console.error(err); }
    };
    fetchStats();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await api.post("/config", form);
      if (res.status === 200) {
        alert("Configuration sauvegardée avec succès !");
        window.location.reload();
      }
    } catch {
      alert("Erreur lors de la sauvegarde.");
    } finally {
      setLoading(false);
    }
  };

  const addMenuLink = () => {
    setForm({
      ...form,
      header_config: {
        ...form.header_config,
        menu_links: [...form.header_config.menu_links, { label: "Nouveau", url: "#" }]
      }
    });
  };

  const removeMenuLink = (index: number) => {
    const links = [...form.header_config.menu_links];
    links.splice(index, 1);
    setForm({ ...form, header_config: { ...form.header_config, menu_links: links } });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2><Layout size={32} /> Système de Gestion Storefront</h2>
        <p>Prenez le contrôle total de l'apparence et de l'expérience utilisateur de votre plateforme.</p>
      </header>

      <nav className={styles.tabs}>
        <button onClick={() => setActiveTab("global")} className={`${styles.tab} ${activeTab === 'global' ? styles.activeTab : ''}`}>
          <Palette size={18} /> Global & Thème
        </button>
        <button onClick={() => setActiveTab("navigation")} className={`${styles.tab} ${activeTab === 'navigation' ? styles.activeTab : ''}`}>
          <Menu size={18} /> Navigation & Menu
        </button>
        <button onClick={() => setActiveTab("content")} className={`${styles.tab} ${activeTab === 'content' ? styles.activeTab : ''}`}>
          <Layers size={18} /> Sections & Contenu
        </button>
        <button onClick={() => setActiveTab("business")} className={`${styles.tab} ${activeTab === 'business' ? styles.activeTab : ''}`}>
          <TrendingUp size={18} /> Business & Prix
        </button>
      </nav>

      <div className={styles.grid}>
        {activeTab === "global" && (
          <>
            <div className={styles.card}>
              <div className={styles.cardTitle}><Type size={20} /> <h3>Identité & Marque</h3></div>
              <div className={styles.inputGroup}>
                <label>Nom de l'Agence</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div className={styles.inputGroup}>
                <label>Slogan de la plateforme</label>
                <input type="text" value={form.slogan} onChange={e => setForm({...form, slogan: e.target.value})} />
              </div>
              <div className={styles.inputGroup}>
                <label>Couleur Primaire</label>
                <div className={styles.colorPicker}>
                  <input type="color" value={form.primary_color} onChange={e => setForm({...form, primary_color: e.target.value})} />
                  <input type="text" value={form.primary_color} onChange={e => setForm({...form, primary_color: e.target.value})} />
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardTitle}><Sliders size={20} /> <h3>Design du Système</h3></div>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Bordures (Radius)</label>
                  <select value={form.theme_config.border_radius} onChange={e => setForm({...form, theme_config: {...form.theme_config, border_radius: e.target.value}})}>
                    <option value="0px">Carré (0px)</option>
                    <option value="12px">Arrondi (12px)</option>
                    <option value="24px">Premium (24px)</option>
                    <option value="40px">Extra (40px)</option>
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label>Style de Bouton</label>
                  <select value={form.theme_config.button_style} onChange={e => setForm({...form, theme_config: {...form.theme_config, button_style: e.target.value}})}>
                    <option value="square">Carré</option>
                    <option value="rounded">Arrondi</option>
                    <option value="pill">Pillule</option>
                  </select>
                </div>
              </div>
              <div className={styles.toggleRow}>
                <label className={styles.toggleLabel}>
                  <input type="checkbox" checked={form.theme_config.glassmorphism} onChange={e => setForm({...form, theme_config: {...form.theme_config, glassmorphism: e.target.checked}})} />
                  Effet Glassmorphism
                </label>
              </div>
              <div className={styles.previewBox}>
                <span>Aperçu interactif</span>
                <button style={{ backgroundColor: form.primary_color, borderRadius: form.theme_config.border_radius }}>Bouton d'exemple</button>
              </div>
            </div>
          </>
        )}

        {activeTab === "navigation" && (
          <>
            <div className={styles.card}>
              <div className={styles.cardTitle}><Monitor size={20} /> <h3>Configuration Header</h3></div>
              <div className={styles.toggleRow}>
                <label className={styles.toggleLabel}>
                  <input type="checkbox" checked={form.header_config.sticky} onChange={e => setForm({...form, header_config: {...form.header_config, sticky: e.target.checked}})} />
                  Menu Fixe (Sticky)
                </label>
                <label className={styles.toggleLabel}>
                  <input type="checkbox" checked={form.header_config.transparent_hero} onChange={e => setForm({...form, header_config: {...form.header_config, transparent_hero: e.target.checked}})} />
                  Menu Transparent sur Hero
                </label>
              </div>
              <div className={styles.inputGroup}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <label>Menu de Navigation</label>
                  <button className={styles.addBtn} onClick={addMenuLink}><Plus size={14}/> Ajouter</button>
                </div>
                <div className={styles.itemList}>
                  {form.header_config.menu_links.map((link, i) => (
                    <div key={i} className={styles.itemEntry}>
                      <input type="text" placeholder="Label" value={link.label} onChange={e => {
                        const links = [...form.header_config.menu_links];
                        links[i].label = e.target.value;
                        setForm({...form, header_config: {...form.header_config, menu_links: links}});
                      }} />
                      <input type="text" placeholder="URL" value={link.url} onChange={e => {
                        const links = [...form.header_config.menu_links];
                        links[i].url = e.target.value;
                        setForm({...form, header_config: {...form.header_config, menu_links: links}});
                      }} />
                      <button className={styles.delBtn} onClick={() => removeMenuLink(i)}><Trash2 size={14}/></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardTitle}><Smartphone size={20} /> <h3>Configuration Footer</h3></div>
              <div className={styles.inputGroup}>
                <label>Téléphone de contact</label>
                <input type="text" value={form.footer_config.phone} onChange={e => setForm({...form, footer_config: {...form.footer_config, phone: e.target.value}})} />
              </div>
              <div className={styles.inputGroup}>
                <label>Email de support</label>
                <input type="email" value={form.footer_config.email} onChange={e => setForm({...form, footer_config: {...form.footer_config, email: e.target.value}})} />
              </div>
              <div className={styles.inputGroup}>
                <label>Adresse physique</label>
                <textarea rows={2} value={form.footer_config.address} onChange={e => setForm({...form, footer_config: {...form.footer_config, address: e.target.value}})} />
              </div>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Facebook URL</label>
                  <input type="text" value={form.footer_config.social_links.facebook} onChange={e => setForm({...form, footer_config: {...form.footer_config, social_links: {...form.footer_config.social_links, facebook: e.target.value}}})} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Instagram URL</label>
                  <input type="text" value={form.footer_config.social_links.instagram} onChange={e => setForm({...form, footer_config: {...form.footer_config, social_links: {...form.footer_config.social_links, instagram: e.target.value}}})} />
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "content" && (
          <>
            <div className={`${styles.card} ${styles.cardFull}`}>
              <div className={styles.cardTitle}><ImageIcon size={20} /> <h3>Main Hero & Bannière</h3></div>
              <div className={styles.inputGroup}>
                <label>Image de fond (URL)</label>
                <input type="text" value={form.hero_image_url} onChange={e => setForm({...form, hero_image_url: e.target.value})} placeholder="https://images.unsplash.com/..." />
              </div>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Description FR</label>
                  <textarea rows={3} value={form.about_text_fr} onChange={e => setForm({...form, about_text_fr: e.target.value})} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Description EN</label>
                  <textarea rows={3} value={form.about_text_en} onChange={e => setForm({...form, about_text_en: e.target.value})} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Description AR</label>
                  <textarea rows={3} dir="rtl" value={form.about_text_ar} onChange={e => setForm({...form, about_text_ar: e.target.value})} />
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardTitle}><Hash size={20} /> <h3>Compteurs & Stats</h3></div>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Stat 1 (Label)</label>
                  <input type="text" value={form.stats_config.label_1} onChange={e => setForm({...form, stats_config: {...form.stats_config, label_1: e.target.value}})} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Stat 1 (Valeur)</label>
                  <input type="text" value={form.stats_config.value_1} onChange={e => setForm({...form, stats_config: {...form.stats_config, value_1: e.target.value}})} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Stat 2 (Label)</label>
                  <input type="text" value={form.stats_config.label_2} onChange={e => setForm({...form, stats_config: {...form.stats_config, label_2: e.target.value}})} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Stat 2 (Valeur)</label>
                  <input type="text" value={form.stats_config.value_2} onChange={e => setForm({...form, stats_config: {...form.stats_config, value_2: e.target.value}})} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Stat 3 (Label)</label>
                  <input type="text" value={form.stats_config.label_3} onChange={e => setForm({...form, stats_config: {...form.stats_config, label_3: e.target.value}})} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Stat 3 (Valeur)</label>
                  <input type="text" value={form.stats_config.value_3} onChange={e => setForm({...form, stats_config: {...form.stats_config, value_3: e.target.value}})} />
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardTitle}><CheckCircle2 size={20} /> <h3>Visibilité des Sections</h3></div>
              <div className={styles.toggleGrid}>
                {Object.entries(form.sections_config).map(([key, val]) => (
                  <label key={key} className={styles.toggleLabel}>
                    <input type="checkbox" checked={val as boolean} onChange={e => setForm({
                      ...form, sections_config: {...form.sections_config, [key]: e.target.checked}
                    })} />
                    {key.replace('_', ' ').charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "business" && (
          <>
            <div className={styles.card}>
              <div className={styles.cardTitle}><Globe size={20} /> <h3>Tarification Globale (DH/Jour)</h3></div>
              <div className={styles.formRow}>
                {Object.entries(form.category_prices).map(([key, val]) => (
                  <div key={key} className={styles.inputGroup}>
                    <label>{key}</label>
                    <input type="number" value={val as number} onChange={e => setForm({
                      ...form, category_prices: {...form.category_prices, [key]: Number(e.target.value)}
                    })} />
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardTitle}><TrendingUp size={20} /> <h3>Performance Live</h3></div>
              <div className={styles.statsList}>
                {stats.length === 0 ? <p>En attente de données...</p> : stats.map((s, i) => (
                  <div key={i} className={styles.statRow}>
                    <span className={styles.statLabel}>{s.category?.toUpperCase()}</span>
                    <div className={styles.statValue}>
                      <strong>{Number(s.total_revenue).toLocaleString()} DH</strong>
                      <span>{s.reservation_count} rés.</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <footer className={styles.footer}>
        <button className={styles.saveBtn} onClick={handleSave} disabled={loading}>
          {loading ? <Loader2 size={20} className={styles.spin} /> : <Save size={20} />}
          Déployer les modifications sur le site
        </button>
      </footer>
    </div>
  );
}
