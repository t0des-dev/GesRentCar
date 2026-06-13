"use client";

import { Tag, Calendar, Gift, Zap } from "lucide-react";

const OFFERS = [
  {
    title: "Early Bird Special",
    discount: "15% OFF",
    desc: "Book 30 days in advance and save big on your rental.",
    code: "EARLY2024",
    icon: Calendar,
    color: "bg-blue-500",
  },
  {
    title: "Weekend Escape",
    discount: "20% OFF",
    desc: "Special rates for rentals from Friday to Monday.",
    code: "WEEKEND",
    icon: Zap,
    color: "bg-amber-500",
  },
  {
    title: "Long Term Rental",
    discount: "30% OFF",
    desc: "Get amazing monthly rates for rentals over 21 days.",
    code: "LONGSTAY",
    icon: Gift,
    color: "bg-purple-500",
  }
];

export default function OffersPage() {
  return (
    <main className="min-h-screen py-28 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-primary text-[10px] font-semibold uppercase tracking-[0.2em] mb-3">Exclusive Deals</p>
          <h1 className="text-4xl md:text-6xl font-semibold text-slate-900 tracking-tighter mb-6">Special Offers</h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Take advantage of our limited-time promotions and enjoy premium luxury for less.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {OFFERS.map((offer) => {
            const Icon = offer.icon;
            return (
              <div key={offer.title} className="group relative bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <div className={`${offer.color} h-32 flex items-center justify-center text-white`}>
                  <Icon size={48} strokeWidth={1.5} />
                </div>
                <div className="p-8 text-center">
                  <div className="inline-block bg-primary/10 text-primary text-[10px] font-semibold px-3 py-1 rounded-full mb-4">
                    LIMITED TIME
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">{offer.title}</h2>
                  <div className="text-4xl font-semibold text-primary mb-4">{offer.discount}</div>
                  <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                    {offer.desc}
                  </p>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-dashed border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-slate-400">Promo Code</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-slate-50 rounded-xl font-mono font-semibold text-lg border border-slate-200">
                    {offer.code}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
