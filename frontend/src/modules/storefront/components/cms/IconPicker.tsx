"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Check } from "lucide-react";
import type { ComponentType } from "react";
import {
  Clock, Car, Target, Shield, CreditCard, Zap,
  Users, Phone, Star, Award, MapPin, TrendingUp,
  Heart, Globe, Crown, CheckCircle, Headphones, Sparkles, ShieldCheck,
  Plane, Train, Bus, Bike, Truck, Navigation,
  Home, Building, Hotel, Store, Warehouse,
  Camera, Image, Video, Music, Mic,
  Sun, Moon, Cloud, Wind, Umbrella, Snowflake, Flame,
  Coffee, Utensils, Wine, ShoppingCart, Gift, Tag, Percent,
  Calendar, Clock2, Timer, AlarmClock, Hourglass,
  Lock, Key, Fingerprint, Eye, EyeOff, Bell, BellOff,
  Wifi, Bluetooth, Battery, Plug, Monitor, Smartphone, Laptop,
  Mail, MessageCircle, Send, Share, Link, QrCode,
  Settings, Sliders, ToggleLeft, ToggleRight, Wrench,
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, ChevronRight, RefreshCw,
  Plus, Minus, X as XIcon, Check as CheckIcon, AlertCircle, Info,
  Briefcase, BookOpen, Clipboard, FileText, FolderOpen,
  Scissors, Brush, Palette, Pen, PenTool, Eraser,
  Mountain, Trees, Leaf, Flower, Bug,
  User, UserCheck, UserPlus, UserX, Baby,
  ThumbsUp, ThumbsDown, Smile, Frown, Meh,
  Package, Box, Archive, Inbox, Layers,
  Anchor, Flag, Compass, Map, Route,
  Music2, Volume2, VolumeX, Radio, Podcast,
  Rocket, Satellite, Globe2, Orbit,
  Diamond, Gem, Trophy, Medal, Ribbon,
  Activity, BarChart, PieChart, LineChart, TrendingDown,
} from "lucide-react";

type IconComponent = ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;

export const ALL_ICONS: Record<string, IconComponent> = {
  // Transport & Location
  Car, Plane, Train, Bus, Bike, Truck, Navigation, Compass, Map, Route, Anchor,
  // Avantages service
  Clock, Shield, ShieldCheck, CreditCard, Zap, CheckCircle, Target,
  // Personnes
  Users, User, UserCheck, UserPlus, UserX, Baby,
  // Communication
  Phone, Mail, MessageCircle, Send, Share, Link, Bell, BellOff, Headphones, Mic,
  // Étoiles & Récompenses
  Star, Award, Trophy, Medal, Ribbon, Crown, Diamond, Gem,
  // Lieux
  MapPin, Home, Building, Hotel, Store, Warehouse,
  // Tendances & Charts
  TrendingUp, TrendingDown, Activity, BarChart, PieChart, LineChart,
  // Nature & Météo
  Sun, Moon, Cloud, Wind, Umbrella, Snowflake, Flame, Mountain, Trees, Leaf, Flower,
  // Commerce
  ShoppingCart, Gift, Tag, Percent, Package, Box, Archive, Inbox,
  // Médias
  Camera, Image, Video, Music, Music2, Volume2, VolumeX, Radio, Podcast,
  // Technologie
  Wifi, Bluetooth, Battery, Plug, Monitor, Smartphone, Laptop,
  // Temps
  Calendar, Clock2, Timer, AlarmClock, Hourglass,
  // Sécurité
  Lock, Key, Fingerprint, Eye, EyeOff,
  // Actions
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, ChevronRight, RefreshCw, Plus, Minus,
  // Édition
  Scissors, Brush, Palette, Pen, PenTool, Eraser,
  // Documents
  Briefcase, BookOpen, Clipboard, FileText, FolderOpen,
  // Divers
  Globe, Globe2, Heart, Sparkles, Flag, Layers, Settings, Sliders, Wrench,
  // Émotions
  ThumbsUp, ThumbsDown, Smile, Frown, Meh, Bug,
  // Espace
  Rocket, Satellite, Orbit,
  // Infos
  AlertCircle, Info, QrCode, Check: CheckIcon, X: XIcon, ToggleLeft, ToggleRight,
};

const ICON_CATEGORIES: Record<string, string[]> = {
  "Transport": ["Car", "Plane", "Train", "Bus", "Bike", "Truck", "Navigation", "Compass", "Map", "Route", "Anchor"],
  "Service": ["Clock", "Shield", "ShieldCheck", "CreditCard", "Zap", "CheckCircle", "Target", "Lock", "Key"],
  "Personnes": ["Users", "User", "UserCheck", "UserPlus", "Baby", "Headphones", "Phone", "Smile", "Heart"],
  "Récompenses": ["Star", "Award", "Trophy", "Medal", "Crown", "Diamond", "Gem", "Ribbon", "ThumbsUp"],
  "Commerce": ["ShoppingCart", "Gift", "Tag", "Percent", "Package", "CreditCard", "Globe", "TrendingUp"],
  "Lieux": ["MapPin", "Home", "Building", "Hotel", "Store", "Warehouse", "Mountain", "Flag"],
  "Technologie": ["Wifi", "Smartphone", "Monitor", "Laptop", "Battery", "Plug", "Bluetooth", "Globe2", "Rocket"],
  "Divers": ["Sun", "Moon", "Cloud", "Flame", "Leaf", "Sparkles", "Music", "Camera", "Bell", "Settings", "Layers"],
};

interface IconPickerProps {
  value: string;
  onChange: (name: string) => void;
}

export default function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const CurrentIcon = value && ALL_ICONS[value] ? ALL_ICONS[value] : null;

  const filtered = Object.entries(ALL_ICONS).filter(([name]) => {
    const matchSearch = !search || name.toLowerCase().includes(search.toLowerCase());
    const matchCat = !activeCategory || (ICON_CATEGORIES[activeCategory]?.includes(name) ?? false);
    return matchSearch && matchCat;
  });

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white hover:border-primary/40 hover:bg-primary/5 transition-all text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        {CurrentIcon ? (
          <>
            <span className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <CurrentIcon size={16} strokeWidth={1.8} className="text-primary" />
            </span>
            <span className="font-semibold text-slate-800">{value}</span>
          </>
        ) : (
          <>
            <span className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
              <span className="text-slate-300 text-xs font-black">?</span>
            </span>
            <span className="text-slate-400">Choisir une icône…</span>
          </>
        )}
        <span className="ml-auto text-slate-300 text-xs">▼</span>
      </button>

      {/* Dropdown picker */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 top-full mt-2 left-0 right-0 min-w-[320px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
            style={{ maxHeight: "420px", display: "flex", flexDirection: "column" }}
          >
            {/* Search bar */}
            <div className="p-3 border-b border-slate-100 flex items-center gap-2 shrink-0">
              <Search size={14} className="text-slate-400 shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Rechercher une icône…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setActiveCategory(null); }}
                className="flex-1 text-sm font-medium text-slate-800 placeholder:text-slate-300 bg-transparent outline-none"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-slate-300 hover:text-slate-500 transition-colors">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Categories tabs */}
            {!search && (
              <div className="flex gap-1.5 px-3 py-2 border-b border-slate-100 overflow-x-auto shrink-0 scrollbar-hide">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    !activeCategory ? "bg-primary text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  Tous
                </button>
                {Object.keys(ICON_CATEGORIES).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
                    className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeCategory === cat ? "bg-primary text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Icons grid */}
            <div className="overflow-y-auto p-3 flex-1">
              {filtered.length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-8">Aucune icône trouvée pour &quot;{search}&quot;</p>
              ) : (
                <div className="grid grid-cols-6 gap-1.5">
                  {filtered.map(([name, IconComp]) => {
                    const isSelected = value === name;
                    return (
                      <button
                        key={name}
                        type="button"
                        title={name}
                        onClick={() => { onChange(name); setOpen(false); setSearch(""); }}
                        className={`relative group flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl transition-all ${
                          isSelected
                            ? "bg-primary text-white shadow-md shadow-primary/25"
                            : "bg-slate-50 text-slate-600 hover:bg-primary/10 hover:text-primary"
                        }`}
                      >
                        <IconComp size={18} strokeWidth={1.6} />
                        <span className="text-[8px] font-bold leading-none truncate w-full text-center opacity-70">
                          {name}
                        </span>
                        {isSelected && (
                          <span className="absolute top-1 right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                            <Check size={8} className="text-primary" strokeWidth={3} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-3 py-2 border-t border-slate-100 shrink-0">
              <p className="text-[10px] text-slate-400 text-center">
                {filtered.length} icône{filtered.length > 1 ? "s" : ""} disponible{filtered.length > 1 ? "s" : ""}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
