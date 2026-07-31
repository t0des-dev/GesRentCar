"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, GripVertical, Type, Image, LayoutGrid, MessageSquare, HelpCircle, Minus, Rocket } from "lucide-react";
import type { Page, ContentBlock } from "@/types/page";
import { motion, AnimatePresence } from "framer-motion";
import TiptapEditor from "@/components/TiptapEditor";

const BLOCK_TYPES = [
  { type: "text", label: "Texte", icon: Type, color: "bg-blue-100 text-blue-600" },
  { type: "image", label: "Image", icon: Image, color: "bg-emerald-100 text-emerald-600" },
  { type: "cards", label: "Cartes", icon: LayoutGrid, color: "bg-violet-100 text-violet-600" },
  { type: "cta", label: "CTA", icon: Rocket, color: "bg-orange-100 text-orange-600" },
  { type: "faq", label: "FAQ", icon: HelpCircle, color: "bg-pink-100 text-pink-600" },
  { type: "divider", label: "Séparateur", icon: Minus, color: "bg-slate-100 text-slate-600" },
] as const;

const TEMPLATES = [
  { value: "default", label: "Par défaut" },
  { value: "full-width", label: "Pleine largeur" },
  { value: "landing", label: "Landing Page" },
] as const;

function BlockEditor({ block, onChange, onRemove }: { block: ContentBlock; onChange: (data: Record<string, any>) => void; onRemove: () => void }) {
  const update = (key: string, value: any) => onChange({ ...block.data, [key]: value });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-widest text-slate-400">
          Bloc: {BLOCK_TYPES.find(b => b.type === block.type)?.label || block.type}
        </span>
        <button onClick={onRemove} className="text-red-400 hover:text-red-600 transition-colors">
          <Trash2 size={16} />
        </button>
      </div>

      {block.type === "text" && (
        <>
          <input
            value={block.data.title || ""}
            onChange={(e) => update("title", e.target.value)}
            placeholder="Titre du bloc"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-primary"
          />
          <TiptapEditor
            content={block.data.body || ""}
            onChange={(html) => update("body", html)}
            placeholder="Écrivez votre contenu ici..."
          />
        </>
      )}

      {block.type === "image" && (
        <>
          <input
            value={block.data.image_url || ""}
            onChange={(e) => update("image_url", e.target.value)}
            placeholder="URL de l'image"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary"
          />
          <input
            value={block.data.alt || ""}
            onChange={(e) => update("alt", e.target.value)}
            placeholder="Texte alternatif"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary"
          />
          <input
            value={block.data.caption || ""}
            onChange={(e) => update("caption", e.target.value)}
            placeholder="Légende"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary"
          />
        </>
      )}

      {block.type === "cards" && (
        <CardListEditor
          items={block.data.items || []}
          onChange={(items) => update("items", items)}
        />
      )}

      {block.type === "cta" && (
        <>
          <input
            value={block.data.title || ""}
            onChange={(e) => update("title", e.target.value)}
            placeholder="Titre CTA"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary"
          />
          <input
            value={block.data.subtitle || ""}
            onChange={(e) => update("subtitle", e.target.value)}
            placeholder="Sous-titre"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              value={block.data.button_text || ""}
              onChange={(e) => update("button_text", e.target.value)}
              placeholder="Texte du bouton"
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary"
            />
            <input
              value={block.data.button_link || ""}
              onChange={(e) => update("button_link", e.target.value)}
              placeholder="Lien du bouton"
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <input
            type="color"
            value={block.data.background_color || "#16213E"}
            onChange={(e) => update("background_color", e.target.value)}
            className="w-full h-10 rounded-xl border border-slate-200 cursor-pointer"
          />
        </>
      )}

      {block.type === "faq" && (
        <FaqListEditor
          items={block.data.items || []}
          onChange={(items) => update("items", items)}
        />
      )}
    </div>
  );
}

function CardListEditor({ items, onChange }: { items: any[]; onChange: (items: any[]) => void }) {
  const addItem = () => onChange([...items, { title: "", desc: "", image: "" }]);
  const updateItem = (i: number, key: string, val: string) => {
    const copy = [...items];
    copy[i] = { ...copy[i], [key]: val };
    onChange(copy);
  };
  const removeItem = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="bg-slate-50 rounded-xl p-3 space-y-2 border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Carte {i + 1}</span>
            <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
          </div>
          <input value={item.title || ""} onChange={(e) => updateItem(i, "title", e.target.value)} placeholder="Titre" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-primary" />
          <input value={item.desc || ""} onChange={(e) => updateItem(i, "desc", e.target.value)} placeholder="Description" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-primary" />
          <input value={item.image || ""} onChange={(e) => updateItem(i, "image", e.target.value)} placeholder="URL image" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-primary" />
        </div>
      ))}
      <button onClick={addItem} className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary/80 transition-colors">
        <Plus size={14} /> Ajouter une carte
      </button>
    </div>
  );
}

function FaqListEditor({ items, onChange }: { items: any[]; onChange: (items: any[]) => void }) {
  const addItem = () => onChange([...items, { q: "", a: "" }]);
  const updateItem = (i: number, key: string, val: string) => {
    const copy = [...items];
    copy[i] = { ...copy[i], [key]: val };
    onChange(copy);
  };
  const removeItem = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="bg-slate-50 rounded-xl p-3 space-y-2 border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Question {i + 1}</span>
            <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
          </div>
          <input value={item.q || ""} onChange={(e) => updateItem(i, "q", e.target.value)} placeholder="Question" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-primary" />
          <textarea value={item.a || ""} onChange={(e) => updateItem(i, "a", e.target.value)} placeholder="Réponse" rows={2} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-primary resize-y" />
        </div>
      ))}
      <button onClick={addItem} className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary/80 transition-colors">
        <Plus size={14} /> Ajouter une question
      </button>
    </div>
  );
}

export default function PageEditor({
  isOpen,
  onClose,
  page,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  page: Page | null;
  onSave: (data: Partial<Page>) => void;
}) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [template, setTemplate] = useState<string>("default");
  const [status, setStatus] = useState<string>("draft");
  const [sortOrder, setSortOrder] = useState(0);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (page) {
      setTitle(page.title);
      setSlug(page.slug);
      setTemplate(page.template);
      setStatus(page.status);
      setSortOrder(page.sort_order);
      setMetaTitle(page.meta?.seo_title || "");
      setMetaDesc(page.meta?.seo_description || "");
      setOgImage(page.meta?.og_image || "");
      setBlocks(page.content || []);
    } else {
      setTitle("");
      setSlug("");
      setTemplate("default");
      setStatus("draft");
      setSortOrder(0);
      setMetaTitle("");
      setMetaDesc("");
      setOgImage("");
      setBlocks([]);
    }
  }, [page, isOpen]);

  const generateSlug = (t: string) => {
    return t
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const addBlock = (type: ContentBlock["type"]) => {
    setBlocks([...blocks, { id: crypto.randomUUID(), type, data: {} }]);
  };

  const updateBlock = (index: number, data: Record<string, any>) => {
    const copy = [...blocks];
    copy[index] = { ...copy[index], data };
    setBlocks(copy);
  };

  const removeBlock = (index: number) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title.trim() || !slug.trim()) return;
    setSaving(true);
    onSave({
      title: title.trim(),
      slug: slug.trim(),
      template: template as any,
      status: status as any,
      sort_order: sortOrder,
      content: blocks,
      meta: {
        seo_title: metaTitle || undefined,
        seo_description: metaDesc || undefined,
        og_image: ogImage || undefined,
      },
    });
    setSaving(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-2xl bg-white h-full overflow-y-auto shadow-2xl">
        <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900">
            {page ? "Modifier la page" : "Nouvelle page"}
          </h2>
          <button onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Informations</h3>
            <input
              value={title}
              onChange={(e) => { setTitle(e.target.value); if (!page) setSlug(generateSlug(e.target.value)); }}
              placeholder="Titre de la page"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-primary"
            />
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">/</span>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="slug-de-la-page"
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:border-primary"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <select value={template} onChange={(e) => setTemplate(e.target.value)} className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary">
                {TEMPLATES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary">
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
              </select>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                placeholder="Ordre"
                className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">SEO</h3>
            <input
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Titre SEO"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary"
            />
            <textarea
              value={metaDesc}
              onChange={(e) => setMetaDesc(e.target.value)}
              placeholder="Description SEO"
              rows={2}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary resize-y"
            />
            <input
              value={ogImage}
              onChange={(e) => setOgImage(e.target.value)}
              placeholder="URL image OG"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Blocs de contenu</h3>
              <div className="flex gap-2">
                {BLOCK_TYPES.map((bt) => (
                  <button
                    key={bt.type}
                    onClick={() => addBlock(bt.type as ContentBlock["type"])}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider hover:scale-105 transition-all ${bt.color}`}
                    title={`Ajouter ${bt.label}`}
                  >
                    <bt.icon size={12} /> {bt.label}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence>
              {blocks.map((block, i) => (
                <motion.div
                  key={block.id || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <BlockEditor
                    block={block}
                    onChange={(data) => updateBlock(i, data)}
                    onRemove={() => removeBlock(i)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {blocks.length === 0 && (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-400 text-sm">Aucun bloc. Cliquez sur un type ci-dessus pour commencer.</p>
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 bg-slate-100 text-slate-700 rounded-2xl text-sm font-bold hover:bg-slate-200 transition-all">
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !title.trim() || !slug.trim()}
            className="px-6 py-3 bg-primary text-white rounded-2xl text-sm font-bold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Sauvegarde..." : page ? "Mettre à jour" : "Créer la page"}
          </button>
        </div>
      </div>
    </div>
  );
}
