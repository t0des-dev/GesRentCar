"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Car, ArrowRight } from "lucide-react";
import Link from "next/link";
import api from "@/shared/services/client";
import { getImageUrl } from "@/shared/utils/image";

const RECENT_SEARCHES_KEY = "vectoria_recent_searches";
const MAX_RECENT = 5;

interface Vehicle {
  id: number;
  brand: string;
  model: string;
  price_per_day: number;
  image?: string;
  slug: string;
}

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Vehicle[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const saveRecentSearch = useCallback((term: string) => {
    setRecentSearches(prev => {
      const updated = [term, ...prev.filter(s => s !== term)].slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const search = useCallback(async (term: string) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get("/vehicles", { params: { search: term } });
      setResults(data.data || data || []);
      saveRecentSearch(term.trim());
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [saveRecentSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
    if (e.key === "Enter") {
      search(query);
    }
  };

  const selectRecent = (term: string) => {
    setQuery(term);
    search(term);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 rounded-xl bg-surface-1 border border-border hover:border-gold/40 flex items-center justify-center transition-colors text-ink-2 hover:text-gold"
        aria-label="Recherche globale"
      >
        <Search className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed top-[10%] left-1/2 -translate-x-1/2 z-[101] w-[90%] max-w-2xl"
            >
              <div className="backdrop-blur-xl bg-surface-0/90 rounded-2xl border border-border shadow-2xl overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
                  <Search className="h-5 w-5 text-ink-3 flex-shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Rechercher un véhicule..."
                    className="flex-1 bg-transparent text-ink-1 placeholder:text-ink-3 outline-none text-base"
                  />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-ink-3 hover:text-ink-1 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-4">
                  {loading && (
                    <div className="flex items-center justify-center py-8">
                      <div className="h-6 w-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  {!loading && query && results.length === 0 && (
                    <p className="text-center text-ink-3 py-8 text-sm">
                      Aucun véhicule trouvé pour &ldquo;{query}&rdquo;
                    </p>
                  )}

                  {!loading && !query && recentSearches.length > 0 && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-ink-3 mb-3">
                        Recherches récentes
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map(term => (
                          <button
                            key={term}
                            onClick={() => selectRecent(term)}
                            className="px-3 py-1.5 rounded-lg bg-surface-1 border border-border text-sm text-ink-2 hover:border-gold/40 hover:text-gold transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {!loading && results.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {results.map(vehicle => (
                        <Link
                          key={vehicle.id}
                          href={`/fleet/${vehicle.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="group flex gap-3 p-3 rounded-xl border border-border hover:border-gold/40 bg-surface-1/50 hover:bg-surface-1 transition-all"
                        >
                          <div className="h-16 w-16 rounded-lg overflow-hidden bg-surface-2 flex-shrink-0">
                            {vehicle.image ? (
                              <img
                                src={getImageUrl(vehicle.image)}
                                alt={`${vehicle.brand} ${vehicle.model}`}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-ink-3">
                                <Car className="h-6 w-6" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-ink-1 truncate">
                              {vehicle.brand} {vehicle.model}
                            </p>
                            <p className="text-sm font-bold text-gold mt-0.5">
                              {vehicle.price_per_day} MAD / jour
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-ink-3 group-hover:text-gold transition-colors self-center flex-shrink-0" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
