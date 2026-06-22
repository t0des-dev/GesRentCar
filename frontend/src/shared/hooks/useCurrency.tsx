"use client";

import React, { createContext, useContext, useState } from "react";

type Currency = "MAD" | "EUR" | "USD";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  rates: Record<Currency, number>;
  convert: (amount: number, from?: Currency) => string;
  formatPrice: (value: unknown) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Static rates for demonstration (In production, fetch from an API)
const RATES: Record<Currency, number> = {
  MAD: 1,
  EUR: 0.091,
  USD: 0.098,
};

const SYMBOLS: Record<Currency, string> = {
  MAD: "DH",
  EUR: "€",
  USD: "$",
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "MAD";
    const saved = localStorage.getItem("vectoria_currency") as Currency;
    return saved && ["MAD", "EUR", "USD"].includes(saved) ? saved : "MAD";
  });

  const handleSetCurrency = (c: Currency) => {
    setCurrency(c);
    localStorage.setItem("vectoria_currency", c);
  };

  const convert = (amount: number, _from: Currency = "MAD") => {
    const safe = typeof amount === "number" && !isNaN(amount) ? amount : 0;
    const converted = safe * RATES[currency];
    const formatted = new Intl.NumberFormat("fr-FR", {
      style: "decimal",
      minimumFractionDigits: currency === "MAD" ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(converted);

    return `${formatted} ${SYMBOLS[currency]}`;
  };

  const formatPrice = (value: unknown): string => {
    const num = typeof value === "number" ? value : parseFloat(String(value));
    if (isNaN(num)) return "0";
    return num.toLocaleString("fr-FR");
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: handleSetCurrency, rates: RATES, convert, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
