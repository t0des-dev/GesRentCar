'use client';

import { useState, useEffect, useRef } from 'react';
import { useAgency } from '@/hooks/useAgency';
import Image from "next/image";
import { 
  Save, Palette, Type, Loader2, TrendingUp, Menu, Search, Smartphone, Monitor, Eye, EyeOff, Layers, QrCode, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/shared/services/client';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/shared/utils';
import { useQueryClient } from '@tanstack/react-query';
import type { StorefrontForm } from '@/types/storefront';
import { defaultStorefrontForm } from '@/constants/storefrontDefaults';

// Modular Components
import StorefrontPreview from './StorefrontPreview';
import SEOManager from './cms/SEOManager';

// New Modular Sub-components
import GlobalBranding from './cms/GlobalBranding';
import MenuFooterSettings from './cms/MenuFooterSettings';
import StructureManager from './cms/StructureManager';
import MultilingualSettings from './cms/MultilingualSettings';
import BusinessSettings from './cms/BusinessSettings';

export default function StorefrontManager() {
  const currentAgency = useAgency();
  const initialized = useRef(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('global');
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [showPreview, setShowPreview] = useState(false);
  const [showQR, setShowQR] = useState(false);
  
  const [form, setForm] = useState<StorefrontForm>({ ...defaultStorefrontForm });
  const [previewSectionId, setPreviewSectionId] = useState<string | null>(null);

  useEffect(() => {
    if (currentAgency.agency_name && !initialized.current) {
      setForm(prev => ({
        ...prev,
        ...currentAgency,
        name: currentAgency.agency_name || prev.name,
        slogan: currentAgency.agency_slogan || prev.slogan,
        logo_url: currentAgency.logo_url || prev.logo_url,
        hero_image_url: currentAgency.hero_image_url || prev.hero_image_url,
        sections_config: { ...prev.sections_config, ...currentAgency.sections_config },
        sections_order: currentAgency.sections_order || prev.sections_order,
        seo_config: { ...prev.seo_config, ...currentAgency.seo_config },
        category_prices: currentAgency.category_prices || prev.category_prices,
        header_config: { ...prev.header_config, ...currentAgency.header_config },
        footer_config: { ...prev.footer_config, ...currentAgency.footer_config } as StorefrontForm['footer_config'],
        theme_config: { ...prev.theme_config, ...currentAgency.theme_config } as StorefrontForm['theme_config'],
        stats_config: { ...prev.stats_config, ...currentAgency.stats_config } as StorefrontForm['stats_config'],
        sections_content: { ...prev.sections_content, ...currentAgency.sections_content } as StorefrontForm['sections_content'],
        concierge_config: { ...prev.concierge_config, ...currentAgency.concierge_config } as StorefrontForm['concierge_config']
      } as StorefrontForm));
      initialized.current = true;
    }
  }, [currentAgency]);

  const queryClient = useQueryClient();

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.post('/config', form);
      queryClient.invalidateQueries({ queryKey: ['agency-config'] });
      setSaved(true);
      toast.success('Configuration sauvegardée !');
      setTimeout(() => setSaved(false), 3000);
    } catch {
      toast.error('Erreur lors de la sauvegarde.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'global', label: 'Branding & Identité', icon: Palette },
    { id: 'navigation', label: 'Menu & Navigation', icon: Menu },
    { id: 'cms', label: "Structure de l'Accueil", icon: Layers },
    { id: 'multilingual', label: 'Contenu & Langues', icon: Type },
    { id: 'seo', label: 'SEO & Social Hub', icon: Search },
    { id: 'business', label: 'Tarification & Offres', icon: TrendingUp },
  ];

  return (
    <div className='flex flex-col gap-12'>
      <header className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
        <div><h2 className='text-3xl font-black text-slate-900 tracking-tight'>Atelier Storefront</h2><p className='text-slate-500 font-medium italic mt-1'>Concevez l&apos;expérience digitale de votre agence.</p></div>
        <div className='flex items-center gap-4'>
          <button onClick={() => setShowQR(true)} className='hidden md:flex items-center gap-2 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all border bg-white text-slate-600 border-slate-200 hover:bg-slate-50 shadow-sm'><QrCode size={14} /> Test Mobile</button>
          <button onClick={() => setShowPreview(!showPreview)} className={cn('hidden lg:flex items-center gap-3 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all border', showPreview ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-white text-slate-600 border-slate-200')}>{showPreview ? <EyeOff size={14} /> : <Eye size={14} />} {showPreview ? 'Masquer Aperçu' : 'Aperçu Live'}</button>
          <button onClick={handleSave} disabled={loading} className={cn('flex items-center gap-3 text-white px-10 py-4 rounded-3xl font-black uppercase tracking-widest text-xs transition-all shadow-xl active:scale-95 disabled:opacity-50', saved ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-primary shadow-primary/20 hover:bg-blue-600')}>{loading ? <Loader2 size={18} className='animate-spin' /> : saved ? <>✓</> : <Save size={18} />} {loading ? 'Sauvegarde...' : saved ? 'Sauvegardé' : 'Enregistrer'}</button>
        </div>
      </header>

      {/* Horizontal Tabs */}
      <div className='flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar border-b-2 border-border'>
        {tabs.map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)} 
            className={cn(
              'whitespace-nowrap shrink-0 flex items-center gap-3 px-6 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm border-2', 
              activeTab === tab.id 
                ? 'bg-gold/10 text-gold border-gold/20 shadow-sm' 
                : 'text-ink-3 hover:bg-surface-0 hover:text-ink-1 border-transparent hover:border-border'
            )}
          >
            <tab.icon size={18} strokeWidth={2.5} className={activeTab === tab.id ? 'text-gold' : 'text-ink-3'} /> 
            {tab.label}
          </button>
        ))}
      </div>

      <div className='transition-all duration-500 flex flex-col xl:flex-row gap-10 max-w-full w-full'>
        <div className='flex-1 space-y-8 min-w-0'>
          <AnimatePresence mode='wait'>
            {activeTab === 'global' && <GlobalBranding form={form} setForm={setForm} />}
            {activeTab === 'navigation' && <MenuFooterSettings form={form} setForm={setForm} />}
            {activeTab === 'cms' && <StructureManager form={form} setForm={setForm} onNavigate={setActiveTab} onSelectSection={setPreviewSectionId} />}
            {activeTab === 'multilingual' && <MultilingualSettings form={form} setForm={setForm} />}
            {activeTab === 'seo' && <SEOManager config={form.seo_config} onChange={(seo) => setForm({ ...form, seo_config: seo })} />}
            {activeTab === 'business' && <BusinessSettings form={form} setForm={setForm} />}
          </AnimatePresence>
        </div>

        {showPreview && (
          <div className='xl:w-[450px] shrink-0'>
            <div className='sticky top-32 space-y-4'>
              {/* Simulator Controls */}
              <div className='flex items-center justify-between bg-white p-3 rounded-2xl border-2 border-border shadow-sm'>
                <div className='flex items-center gap-2 ml-2'>
                  <div className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
                  <span className='text-[10px] font-black uppercase tracking-widest text-ink-3'>Aperçu Live</span>
                </div>
                <div className='flex gap-1'>
                  <button onClick={() => setPreviewDevice('mobile')} className={cn('p-2 rounded-xl transition-all', previewDevice === 'mobile' ? 'bg-gold/10 text-gold' : 'text-ink-3 hover:bg-surface-0')}><Smartphone size={16} strokeWidth={2.5} /></button>
                  <button onClick={() => setPreviewDevice('desktop')} className={cn('p-2 rounded-xl transition-all', previewDevice === 'desktop' ? 'bg-gold/10 text-gold' : 'text-ink-3 hover:bg-surface-0')}><Monitor size={16} strokeWidth={2.5} /></button>
                </div>
              </div>
              
              <StorefrontPreview form={form} device={previewDevice} previewSectionId={previewSectionId} />
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showQR && (
          <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm'>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className='bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl relative text-center'>
              <button onClick={() => setShowQR(false)} className='absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors'>
                <X size={16} className='text-slate-500' />
              </button>
              <div className='w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4'>
                <QrCode size={24} />
              </div>
              <h3 className='text-xl font-black text-slate-900 mb-2'>Tester sur Mobile</h3>
              <p className='text-sm text-slate-500 mb-6'>Scannez ce code avec votre téléphone pour prévisualiser la vitrine.</p>
              <div className='bg-slate-50 p-4 rounded-3xl border border-slate-100 inline-block'>
                <Image src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')}`} alt='QR Code' width={192} height={192} className='w-48 h-48 mx-auto rounded-xl' />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
