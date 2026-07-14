import type { PromoResult } from "@/types/booking";

const HIGH_SEASON_MONTHS = [7, 8, 12];
const LONG_STAY_TIERS = [
  { days: 14, multiplier: 0.85, label: "Tarif 2 semaines" },
  { days: 7, multiplier: 0.90, label: "Tarif semaine" },
];
const OPTION_FLEXIBILITY_PER_DAY = 60;
const OPTION_UNLIMITED_MILEAGE_PER_DAY = 140;

export interface PricingInput {
  pricePerDay: number;
  days: number;
  startDate: string;
  flexibility?: "best_price" | "flexible";
  mileage?: "limited" | "unlimited";
  promo?: PromoResult;
}

export interface PricingResult {
  total: number;
  basePrice: number;
  dailyRate: number;
  optionsPrice: number;
  deposit: number;
  dynamicReason: string | null;
  breakdown: Array<{ label: string; amount: number }>;
}

export function calculatePrice(input: PricingInput): PricingResult {
  const days = Math.max(1, input.days);
  const startDate = input.startDate ? new Date(input.startDate) : new Date();
  const pricePerDay = parseFloat(String(input.pricePerDay)) || 0;

  const month = startDate.getMonth() + 1;
  const dayOfWeek = startDate.getDay();
  const adjustedDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

  let multiplier = 1.0;
  let reason: string | null = null;

  const isHighSeason = HIGH_SEASON_MONTHS.includes(month);
  const isWeekend = adjustedDayOfWeek >= 5;

  if (isHighSeason) {
    multiplier = 1.30;
    reason = "Haute saison";
  } else if (isWeekend) {
    multiplier = 1.10;
    reason = "Tarif weekend";
  }

  let longStayDiscount = 1.0;
  let longStayReason: string | null = null;
  for (const tier of LONG_STAY_TIERS) {
    if (days >= tier.days) {
      longStayDiscount = tier.multiplier;
      longStayReason = tier.label;
      break;
    }
  }
  multiplier *= longStayDiscount;
  if (longStayReason) {
    reason = reason ? `${reason} + ${longStayReason}` : longStayReason;
  }

  const dailyRate = Math.round(pricePerDay * multiplier * 100) / 100;
  const basePrice = Math.round(dailyRate * days * 100) / 100;

  let optionsPrice = 0;
  const breakdown: Array<{ label: string; amount: number }> = [];

  breakdown.push({
    label: `Véhicule × ${days} jour(s)`,
    amount: basePrice,
  });

  if (reason) {
    const pct = Math.round((multiplier - 1) * 100);
    breakdown.push({
      label: `${reason} (${pct >= 0 ? "+" : ""}${pct}%)`,
      amount: 0,
    });
  }

  if (input.flexibility === "flexible") {
    const amt = OPTION_FLEXIBILITY_PER_DAY * days;
    optionsPrice += amt;
    breakdown.push({ label: "Annulation flexible", amount: amt });
  }

  if (input.mileage === "unlimited") {
    const amt = OPTION_UNLIMITED_MILEAGE_PER_DAY * days;
    optionsPrice += amt;
    breakdown.push({ label: "Kilométrage illimité", amount: amt });
  }

  let promoDiscount = 0;
  if (input.promo?.valid) {
    if (input.promo.type === "fixed") {
      promoDiscount = input.promo.value;
    } else {
      promoDiscount = Math.round((basePrice + optionsPrice) * input.promo.value / 100 * 100) / 100;
    }
    if (promoDiscount > 0) {
      breakdown.push({ label: "Code promo", amount: -promoDiscount });
    }
  }

  const total = Math.max(0, Math.round((basePrice + optionsPrice - promoDiscount) * 100) / 100);
  const deposit = Math.round(total * 0.1 * 100) / 100;

  return { total, basePrice, dailyRate, optionsPrice, deposit, dynamicReason: reason, breakdown };
}
