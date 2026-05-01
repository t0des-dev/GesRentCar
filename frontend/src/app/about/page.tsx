"use client";

import { Award, Shield, Heart, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-28 pb-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mb-16">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Our Story</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6">Redefining Premium Car Rental</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Founded in 2024, Vectoria Rent Car was born from a simple vision: to provide a seamless, premium vehicle rental experience that combines state-of-the-art technology with personalized service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1200" 
              alt="Premium Cars"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              We strive to offer the most exclusive fleet of vehicles in Morocco, maintained to the highest standards of safety and luxury. Our platform is designed to make high-end mobility accessible and hassle-free.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-primary font-bold text-3xl mb-1">500+</div>
                <div className="text-sm text-muted-foreground">Happy Clients</div>
              </div>
              <div>
                <div className="text-primary font-bold text-3xl mb-1">50+</div>
                <div className="text-sm text-muted-foreground">Luxury Vehicles</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: Shield, title: "Secure", desc: "Full insurance coverage" },
            { icon: Award, title: "Premium", desc: "Best-in-class fleet" },
            { icon: Heart, title: "Service", desc: "24/7 client support" },
            { icon: Users, title: "Network", desc: "Agencies across Morocco" },
          ].map((item, i) => (
            <div key={i} className="p-8 bg-card border border-border rounded-2xl text-center">
              <div className="inline-flex bg-primary/10 text-primary p-3 rounded-xl mb-4">
                <item.icon size={24} />
              </div>
              <h3 className="font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
