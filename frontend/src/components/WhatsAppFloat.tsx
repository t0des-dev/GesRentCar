"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppFloat() {
  // In a real app, you might fetch this from the Storefront API
  const phoneNumber = "212600000000"; 
  const message = encodeURIComponent("Bonjour, je souhaite avoir plus d'informations sur vos véhicules de location.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-xl hover:bg-green-600 transition-all hover:scale-110 group"
      aria-label="Contactez-nous sur WhatsApp"
    >
      <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-30 group-hover:opacity-0" />
      <MessageCircle size={28} />
    </a>
  );
}
