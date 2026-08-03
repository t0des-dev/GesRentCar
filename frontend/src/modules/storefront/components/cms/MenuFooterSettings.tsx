"use client";

import { motion } from "framer-motion";
import {
  Monitor,
  Plus,
  Trash2,
  Smartphone,
  ChevronUp,
  ChevronDown,
  Facebook,
  Instagram,
  Share2,
  Phone,
  Mail,
  MapPin,
  Link2,
  Pin,
  Layers,
} from "lucide-react";
import type { StorefrontForm } from "@/types/storefront";
import { cn } from "@/shared/utils";

interface MenuFooterSettingsProps {
  form: StorefrontForm;
  setForm: (v: StorefrontForm) => void;
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────
function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer group py-1">
      <div className="space-y-0.5">
        <span className="text-sm font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
          {label}
        </span>
        {description && (
          <p className="text-[10px] text-slate-400 font-medium">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative shrink-0 w-11 h-6 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
          checked ? "bg-primary" : "bg-slate-200"
        )}
      >
        <span
          className={cn(
            "absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </label>
  );
}

// ─── Social Input ─────────────────────────────────────────────────────────────
function SocialInput({
  icon,
  label,
  value,
  onChange,
  placeholder,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 bg-slate-50/80 border border-slate-200/80 p-3 rounded-2xl hover:bg-white hover:border-slate-300 transition-all group">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white shadow-sm"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-0.5">
          {label}
        </label>
        <input
          type="url"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-300 font-mono"
        />
      </div>
      {value && (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 p-1.5 text-slate-300 hover:text-primary transition-colors"
          title="Ouvrir le lien"
        >
          <Link2 size={14} />
        </a>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MenuFooterSettings({ form, setForm }: MenuFooterSettingsProps) {
  // ── Menu helpers ──
  const addMenuLink = () =>
    setForm({
      ...form,
      header_config: {
        ...form.header_config,
        menu_links: [
          ...(form.header_config.menu_links ?? []),
          { label: "Nouveau", url: "#" },
        ],
      },
    });

  const removeMenuLink = (i: number) => {
    const links = [...(form.header_config.menu_links ?? [])];
    links.splice(i, 1);
    setForm({ ...form, header_config: { ...form.header_config, menu_links: links } });
  };

  const moveLinkUp = (i: number) => {
    if (i === 0) return;
    const links = [...(form.header_config.menu_links ?? [])];
    [links[i], links[i - 1]] = [links[i - 1], links[i]];
    setForm({ ...form, header_config: { ...form.header_config, menu_links: links } });
  };

  const moveLinkDown = (i: number) => {
    const links = [...(form.header_config.menu_links ?? [])];
    if (i >= links.length - 1) return;
    [links[i], links[i + 1]] = [links[i + 1], links[i]];
    setForm({ ...form, header_config: { ...form.header_config, menu_links: links } });
  };

  const updateMenuLink = (i: number, field: "label" | "url", value: string) => {
    const links = [...(form.header_config.menu_links ?? [])];
    links[i] = { ...links[i], [field]: value };
    setForm({ ...form, header_config: { ...form.header_config, menu_links: links } });
  };

  // ── Social helpers ──
  const updateSocial = (key: keyof typeof form.footer_config.social_links, value: string) =>
    setForm({
      ...form,
      footer_config: {
        ...form.footer_config,
        social_links: { ...form.footer_config.social_links, [key]: value },
      },
    });

  const menuLinks = form.header_config.menu_links ?? [];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">

      {/* ── 1. Header Behaviour ─────────────────────────────────────────── */}
      <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-200/60 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <Layers size={20} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">Comportement du Header</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Options de comportement de la barre de navigation
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 space-y-1">
          <div className="pb-4">
            <Toggle
              checked={form.header_config.sticky ?? true}
              onChange={(v) =>
                setForm({ ...form, header_config: { ...form.header_config, sticky: v } })
              }
              label="Header Fixe (Sticky)"
              description="La barre de navigation reste visible lors du défilement de la page"
            />
          </div>
          <div className="pt-4">
            <Toggle
              checked={form.header_config.transparent_hero ?? false}
              onChange={(v) =>
                setForm({
                  ...form,
                  header_config: { ...form.header_config, transparent_hero: v },
                })
              }
              label="Transparent sur le Hero"
              description="Le header est transparent au-dessus de la section Hero principale"
            />
          </div>
        </div>
      </div>

      {/* ── 2. Navigation Menu ──────────────────────────────────────────── */}
      <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-200/60 shadow-sm space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Monitor size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Navigation &amp; Menu</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {menuLinks.length} lien{menuLinks.length !== 1 ? "s" : ""} configuré{menuLinks.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={addMenuLink}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <Plus size={14} /> Ajouter un lien
          </button>
        </div>

        <div className="space-y-3">
          {menuLinks.map((link: { label: string; url: string }, i: number) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-slate-50/80 border border-slate-200/80 p-4 rounded-2xl group hover:bg-white hover:border-slate-300 transition-all"
            >
              {/* Ordering */}
              <div className="flex flex-col gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => moveLinkUp(i)}
                  disabled={i === 0}
                  title="Déplacer vers le haut"
                  className="p-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-600 transition-all"
                >
                  <ChevronUp size={14} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => moveLinkDown(i)}
                  disabled={i === menuLinks.length - 1}
                  title="Déplacer vers le bas"
                  className="p-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-600 transition-all"
                >
                  <ChevronDown size={14} strokeWidth={2.5} />
                </button>
              </div>

              {/* Label */}
              <div className="flex-1 min-w-0">
                <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  Intitulé du lien
                </label>
                <input
                  type="text"
                  value={link.label ?? ""}
                  onChange={(e) => updateMenuLink(i, "label", e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="Ex: Accueil"
                />
              </div>

              {/* URL */}
              <div className="flex-1 min-w-0">
                <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  URL / Destination
                </label>
                <input
                  type="text"
                  value={link.url ?? ""}
                  onChange={(e) => updateMenuLink(i, "url", e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                  placeholder="Ex: /fleet"
                />
              </div>

              {/* Delete */}
              <button
                onClick={() => removeMenuLink(i)}
                title="Supprimer le lien"
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all self-center shrink-0"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {menuLinks.length === 0 && (
            <div className="py-10 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto">
                <Monitor size={22} className="text-slate-300" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500">Aucun lien de navigation</p>
                <p className="text-xs text-slate-400 mt-1">
                  Cliquez sur &quot;Ajouter un lien&quot; pour configurer le menu.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 3. Footer Info ──────────────────────────────────────────────── */}
      <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-200/60 shadow-sm space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Smartphone size={20} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">Informations Footer</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Coordonnées affichées dans le pied de page
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Phone */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <Phone size={16} />
            </div>
            <div className="flex-1">
              <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-0.5">
                Téléphone
              </label>
              <input
                type="tel"
                value={form.footer_config.phone ?? ""}
                onChange={(e) =>
                  setForm({ ...form, footer_config: { ...form.footer_config, phone: e.target.value } })
                }
                placeholder="+212 6 00 00 00 00"
                className="w-full bg-transparent font-bold text-sm text-slate-900 outline-none placeholder:text-slate-300"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Mail size={16} />
            </div>
            <div className="flex-1">
              <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-0.5">
                Email
              </label>
              <input
                type="email"
                value={form.footer_config.email ?? ""}
                onChange={(e) =>
                  setForm({ ...form, footer_config: { ...form.footer_config, email: e.target.value } })
                }
                placeholder="contact@agence.ma"
                className="w-full bg-transparent font-bold text-sm text-slate-900 outline-none placeholder:text-slate-300"
              />
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-3 bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-1">
              <MapPin size={16} />
            </div>
            <div className="flex-1">
              <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-0.5">
                Adresse
              </label>
              <textarea
                rows={2}
                value={form.footer_config.address ?? ""}
                onChange={(e) =>
                  setForm({ ...form, footer_config: { ...form.footer_config, address: e.target.value } })
                }
                placeholder="123 Rue Mohammed V, Casablanca"
                className="w-full bg-transparent font-bold text-sm text-slate-900 outline-none resize-none placeholder:text-slate-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. Réseaux Sociaux ──────────────────────────────────────────── */}
      <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-200/60 shadow-sm space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
            <Share2 size={20} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">Réseaux Sociaux</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Liens affichés dans le footer et partagés sur les réseaux
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <SocialInput
            icon={<Facebook size={16} />}
            label="Facebook"
            color="#1877F2"
            value={form.footer_config.social_links?.facebook ?? ""}
            onChange={(v) => updateSocial("facebook", v)}
            placeholder="https://facebook.com/votre-page"
          />
          <SocialInput
            icon={<Instagram size={16} />}
            label="Instagram"
            color="#E1306C"
            value={form.footer_config.social_links?.instagram ?? ""}
            onChange={(v) => updateSocial("instagram", v)}
            placeholder="https://instagram.com/votre-compte"
          />
          <SocialInput
            icon={
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            }
            label="WhatsApp"
            color="#25D366"
            value={form.footer_config.social_links?.whatsapp ?? ""}
            onChange={(v) => updateSocial("whatsapp", v)}
            placeholder="https://wa.me/212600000000"
          />
          <SocialInput
            icon={
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.28 8.28 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z" />
              </svg>
            }
            label="TikTok"
            color="#010101"
            value={form.footer_config.social_links?.tiktok ?? ""}
            onChange={(v) => updateSocial("tiktok", v)}
            placeholder="https://tiktok.com/@votre-compte"
          />
        </div>

        {/* Preview badges */}
        <div className="flex items-center gap-3 flex-wrap pt-2 border-t border-slate-100">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
            Réseaux actifs
          </span>
          {[
            { key: "facebook", label: "FB", color: "#1877F2" },
            { key: "instagram", label: "IG", color: "#E1306C" },
            { key: "whatsapp", label: "WA", color: "#25D366" },
            { key: "tiktok", label: "TK", color: "#010101" },
          ].map(({ key, label, color }) => {
            const val = (form.footer_config.social_links as Record<string, string>)?.[key];
            return (
              <span
                key={key}
                className={cn(
                  "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all",
                  val
                    ? "text-white shadow-sm"
                    : "bg-slate-100 text-slate-400"
                )}
                style={val ? { backgroundColor: color } : undefined}
              >
                {label}
              </span>
            );
          })}
        </div>
      </div>

      {/* ── 5. Header Branding PIN ──────────────────────────────────────── */}
      <div className="bg-slate-950 p-8 md:p-10 rounded-[40px] space-y-5 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center">
            <Pin size={18} />
          </div>
          <h3 className="text-lg font-black">Résumé de configuration</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Header Sticky",
              value: form.header_config.sticky ?? true ? "Activé" : "Désactivé",
              active: form.header_config.sticky ?? true,
            },
            {
              label: "Hero Transparent",
              value: form.header_config.transparent_hero ? "Activé" : "Désactivé",
              active: form.header_config.transparent_hero,
            },
            {
              label: "Liens Menu",
              value: `${menuLinks.length} lien${menuLinks.length !== 1 ? "s" : ""}`,
              active: menuLinks.length > 0,
            },
            {
              label: "Réseaux Sociaux",
              value: `${
                [
                  form.footer_config.social_links?.facebook,
                  form.footer_config.social_links?.instagram,
                  form.footer_config.social_links?.whatsapp,
                  form.footer_config.social_links?.tiktok,
                ].filter(Boolean).length
              } / 4 configurés`,
              active:
                [
                  form.footer_config.social_links?.facebook,
                  form.footer_config.social_links?.instagram,
                  form.footer_config.social_links?.whatsapp,
                  form.footer_config.social_links?.tiktok,
                ].filter(Boolean).length > 0,
            },
          ].map(({ label, value, active }) => (
            <div
              key={label}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1"
            >
              <p className="text-[9px] text-white/40 font-black uppercase tracking-widest">
                {label}
              </p>
              <p
                className={cn(
                  "text-sm font-black",
                  active ? "text-emerald-400" : "text-white/50"
                )}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
