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
    <main className="min-h-screen pt-28 pb-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Exclusive Deals</p>
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6">Special Offers</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Take advantage of our limited-time promotions and enjoy premium luxury for less.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {OFFERS.map((offer) => {
            const Icon = offer.icon;
            return (
              <div key={offer.title} className="group relative bg-card border border-border rounded-3xl overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2">
                <div className={`${offer.color} h-32 flex items-center justify-center text-white`}>
                  <Icon size={48} strokeWidth={1.5} />
                </div>
                <div className="p-8 text-center">
                  <div className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full mb-4">
                    LIMITED TIME
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{offer.title}</h2>
                  <div className="text-4xl font-black text-primary mb-4">{offer.discount}</div>
                  <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                    {offer.desc}
                  </p>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-dashed border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground font-mono">Promo Code</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-muted rounded-xl font-mono font-bold text-lg border border-border">
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
