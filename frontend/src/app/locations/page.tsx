"use client";

import { MapPin, Phone, Mail, Clock } from "lucide-react";

const LOCATIONS = [
  {
    name: "Marrakech Menara Airport",
    address: "Aéroport Marrakech Ménara, Marrakech 40000",
    phone: "+212 524-447910",
    email: "marrakech@vectoria.com",
    hours: "24/7",
  },
  {
    name: "Casablanca Downtown",
    address: "Angle Boulevard Zerktouni, Casablanca",
    phone: "+212 522-123456",
    email: "casa@vectoria.com",
    hours: "08:00 - 20:00",
  },
  {
    name: "Agadir Al Massira Airport",
    address: "BP 2000, Agadir 80000",
    phone: "+212 528-839112",
    email: "agadir@vectoria.com",
    hours: "24/7",
  }
];

export default function LocationsPage() {
  return (
    <main className="min-h-screen pt-28 pb-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Our Network</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">Pick-up Locations</h1>
          <p className="text-muted-foreground max-w-2xl">
            We are present in the major cities and airports of Morocco. Find the nearest agency to start your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {LOCATIONS.map((loc) => (
            <div key={loc.name} className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="bg-primary/10 text-primary w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <MapPin size={24} />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-4">{loc.name}</h2>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <MapPin size={16} className="mt-0.5 shrink-0" />
                  <span>{loc.address}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Phone size={16} className="shrink-0" />
                  <span>{loc.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail size={16} className="shrink-0" />
                  <span>{loc.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Clock size={16} className="shrink-0" />
                  <span>{loc.hours}</span>
                </div>
              </div>

              <button className="w-full mt-8 py-3 rounded-xl border border-primary text-primary font-medium hover:bg-primary hover:text-white transition-colors">
                View on Map
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
