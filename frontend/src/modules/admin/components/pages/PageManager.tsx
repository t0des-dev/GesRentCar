"use client";

import { useState, useEffect } from "react";
import { Plus, FileText, ExternalLink, Trash2, Pencil, Eye, EyeOff, Car, Settings } from "lucide-react";
import { pageService } from "@/lib/api/pages";
import type { Page } from "@/types/page";
import { ConfirmDialog, notifyError, notifySuccess } from "@/components/Notifications";
import PageEditor from "./PageEditor";
import FleetCmsEditor from "../fleet/FleetCmsEditor";

const SYSTEM_PAGES = [
  {
    id: -1,
    slug: "fleet",
    title: "Page Fleet",
    description: "Éditez aussi via Storefront > Structure > Page Flotte",
    icon: Car,
    color: "bg-amber-100 text-amber-600",
    system: true as const,
  },
  {
    id: -2,
    slug: "home",
    title: "Page d'Accueil",
    description: "Hero, sections, CTA et structure de la page d'accueil",
    icon: Settings,
    color: "bg-indigo-100 text-indigo-600",
    system: true as const,
  },
];

export default function PageManager() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);
  const [editingSystemPage, setEditingSystemPage] = useState<string | null>(null);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const data = await pageService.getAdminPages();
      setPages(data);
    } catch (err) {
      console.error("Error fetching pages", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPages(); }, []);

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      await pageService.deletePage(pendingDelete);
      notifySuccess("Page supprimée");
      fetchPages();
    } catch (err: any) {
      notifyError(err.response?.data?.message || "Erreur lors de la suppression.");
    }
    setPendingDelete(null);
  };

  const handleSave = async (pageData: Partial<Page>) => {
    try {
      if (editingPage) {
        await pageService.updatePage(editingPage.id, pageData);
        notifySuccess("Page mise à jour");
      } else {
        await pageService.createPage(pageData);
        notifySuccess("Page créée");
      }
      setShowEditor(false);
      setEditingPage(null);
      fetchPages();
    } catch (err: any) {
      notifyError(err.response?.data?.message || "Erreur lors de la sauvegarde.");
    }
  };

  const handleToggleStatus = async (page: Page) => {
    try {
      await pageService.updatePage(page.id, {
        status: page.status === "published" ? "draft" : "published",
      });
      fetchPages();
    } catch (err: any) {
      notifyError("Erreur lors du changement de statut.");
    }
  };

  const templateLabel = (t: string) => {
    const map: Record<string, string> = { default: "Par défaut", "full-width": "Pleine largeur", landing: "Landing" };
    return map[t] || t;
  };

  const templateColor = (t: string) => {
    const map: Record<string, string> = {
      default: "bg-slate-100 text-slate-700",
      "full-width": "bg-blue-100 text-blue-700",
      landing: "bg-violet-100 text-violet-700",
    };
    return map[t] || "bg-slate-100 text-slate-700";
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Pages CMS</h2>
          <p className="text-slate-500 font-medium italic mt-1">
            Créez et gérez vos pages marketing et landing pages.
          </p>
        </div>
        <button
          onClick={() => { setEditingPage(null); setShowEditor(true); }}
          className="bg-primary text-white flex items-center gap-2 px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all"
        >
          <Plus size={18} /> Nouvelle Page
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Chargement...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* System Pages */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 px-2">Pages Système</h3>
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden divide-y divide-slate-50">
              {SYSTEM_PAGES.map((sp) => {
                const Icon = sp.icon;
                return (
                  <div key={sp.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl ${sp.color} flex items-center justify-center`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{sp.title}</p>
                        <p className="text-xs text-slate-400">{sp.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`/${sp.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all"
                        title="Voir"
                      >
                        <ExternalLink size={14} />
                      </a>
                      <button
                        onClick={() => setEditingSystemPage(sp.slug)}
                        className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-all"
                        title="Modifier"
                      >
                        <Pencil size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Pages */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 px-2">Pages Personnalisées</h3>
            {pages.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
                <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Aucune page</h3>
                <p className="text-slate-500 mb-6">Commencez par créer votre première page CMS.</p>
                <button
                  onClick={() => { setEditingPage(null); setShowEditor(true); }}
                  className="bg-primary text-white px-6 py-3 rounded-2xl font-bold text-sm hover:scale-105 transition-all"
                >
                  Créer une page
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Page</th>
                      <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Slug</th>
                      <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Template</th>
                      <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Statut</th>
                      <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Mis à jour</th>
                      <th className="text-right px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pages.map((page) => (
                      <tr key={page.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                              <FileText size={18} className="text-primary" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{page.title}</p>
                              {page.meta?.seo_description && (
                                <p className="text-xs text-slate-400 truncate max-w-[200px]">{page.meta.seo_description}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <code className="text-xs bg-slate-100 px-2 py-1 rounded-lg text-slate-600 font-mono">/{page.slug}</code>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${templateColor(page.template)}`}>
                            {templateLabel(page.template)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleStatus(page)}
                            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full transition-all ${
                              page.status === "published"
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                            }`}
                          >
                            {page.status === "published" ? <Eye size={12} /> : <EyeOff size={12} />}
                            {page.status === "published" ? "Publié" : "Brouillon"}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {new Date(page.updated_at).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={`/${page.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all"
                              title="Voir"
                            >
                              <ExternalLink size={14} />
                            </a>
                            <button
                              onClick={() => { setEditingPage(page); setShowEditor(true); }}
                              className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-all"
                              title="Modifier"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => { setPendingDelete(page.id); setConfirmOpen(true); }}
                              className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition-all"
                              title="Supprimer"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CMS Block Editor */}
      <PageEditor
        isOpen={showEditor}
        onClose={() => { setShowEditor(false); setEditingPage(null); }}
        page={editingPage}
        onSave={handleSave}
      />

      {/* Fleet System Page Editor */}
      {editingSystemPage === "fleet" && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditingSystemPage(null)} />
          <div className="relative ml-auto w-full max-w-3xl bg-[#f8fafc] h-full overflow-y-auto shadow-2xl">
            <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900">Modifier la Page Fleet</h2>
              <button onClick={() => setEditingSystemPage(null)} className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all text-slate-500">
                ✕
              </button>
            </div>
            <div className="p-6">
              <FleetCmsEditor />
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Supprimer cette page ?"
        message="Cette action est irréversible. Tous les blocs de contenu seront perdus."
      />
    </div>
  );
}
