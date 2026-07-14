"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface Recommendation {
  id: string;
  brand: string;
  model: string;
  reason: string;
  price: number;
}

interface Message {
  role: "user" | "bot";
  content: string;
  recommendation?: Recommendation;
}

export function useConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Bonjour ! Je suis votre concierge Vectoria. Quel type d'expérience recherchez-vous aujourd'hui ? (Ex: Voyage d'affaires, Mariage, Weekend à la montagne...)" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [weather, setWeather] = useState<{ condition: string; temp: number } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Simulated weather fetch
    setTimeout(() => {
      const conditions = [
        { condition: "Ensoleillé", temp: 28 },
        { condition: "Pluvieux", temp: 18 },
        { condition: "Neigeux (Atlas)", temp: 4 },
        { condition: "Venteux", temp: 22 }
      ];
      setWeather(conditions[Math.floor(Math.random() * conditions.length)]);
    }, 2000);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-concierge", handleOpen);
    return () => window.removeEventListener("open-concierge", handleOpen);
  }, []);

  const handleSend = async (message?: string) => {
    const userMsg = message || input;
    if (!userMsg.trim()) return;

    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setIsTyping(true);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      const res = await fetch(`${apiBase}/concierge/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMsg,
          history: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();
      if (data.success) {
        const topSuggestion = data.suggestions?.[0];
        let rec: Recommendation | undefined = undefined;

        if (topSuggestion) {
          rec = {
            id: String(topSuggestion.id),
            brand: topSuggestion.brand,
            model: topSuggestion.model,
            price: Number(topSuggestion.price_per_day),
            reason: `Recommandé pour votre style ${data.vibe}`,
          };
        }

        setMessages(prev => [...prev, {
          role: "bot",
          content: data.reply,
          recommendation: rec,
        }]);
      } else {
        throw new Error("API success is false");
      }
    } catch (err) {
      console.warn("Concierge API error, falling back to simulated logic", err);
      // Fallback: simulated offline logic
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let response = "C'est un excellent choix. Pour ce type d'occasion, je vous suggère un véhicule qui allie prestige et confort.";
      let recommendation: Recommendation | undefined;

      const lowerMsg = userMsg.toLowerCase();

      if (lowerMsg.includes("mariage") || lowerMsg.includes("fête") || lowerMsg.includes("prestige")) {
        recommendation = { id: "1", brand: "Rolls-Royce", model: "Ghost", price: 12000, reason: "Le summum du luxe pour une journée inoubliable." };
        response = "Félicitations ! Pour un mariage, rien ne remplace l'élégance d'une Rolls-Royce.";
      } else if (lowerMsg.includes("montagne") || lowerMsg.includes("désert") || lowerMsg.includes("famille") || lowerMsg.includes("4x4")) {
        recommendation = { id: "2", brand: "Range Rover", model: "Autobiography", price: 4500, reason: "Puissance et raffinement pour explorer le Maroc." };
        response = "Parfait pour l'aventure. Le Range Rover Autobiography vous offrira confort et sécurité sur tous les terrains.";
      } else if (lowerMsg.includes("sport") || lowerMsg.includes("vitesse") || lowerMsg.includes("circuit")) {
        recommendation = { id: "3", brand: "Porsche", model: "911 Carrera", price: 5500, reason: "Pour des sensations de conduite pures." };
        response = "Je vois que vous aimez la performance. La Porsche 911 est l'icône ultime pour vos trajets sportifs.";
      } else if (lowerMsg.includes("affaires") || lowerMsg.includes("business") || lowerMsg.includes("réunion")) {
        recommendation = { id: "4", brand: "Mercedes-Benz", model: "Classe S", price: 3800, reason: "Le bureau mobile le plus luxueux au monde." };
        response = "Pour vos rendez-vous d'affaires, la Classe S assure une présence discrète et imposante.";
      } else if (lowerMsg.includes("prix") || lowerMsg.includes("tarif") || lowerMsg.includes("coût") || lowerMsg.includes("combien")) {
        response = "Nos tarifs commencent à 1200 DH/jour. Consultez notre catalogue pour voir les prix de chaque véhicule.";
      } else if (lowerMsg.includes("annuler") || lowerMsg.includes("annulation")) {
        response = "Pour annuler, connectez-vous à votre espace client ou contactez-nous directement.";
      } else if (lowerMsg.includes("contact") || lowerMsg.includes("téléphone") || lowerMsg.includes("email") || lowerMsg.includes("appeler")) {
        response = "Contactez-nous au +212 600 00 00 00 ou par email à contact@vectoria.com";
      } else if (lowerMsg.includes("merci") || lowerMsg.includes("au revoir") || lowerMsg.includes("bye")) {
        response = "Merci ! N'hésitez pas à revenir si vous avez d'autres questions. À bientôt !";
      } else if (lowerMsg.includes("assurance") || lowerMsg.includes("assuré")) {
        response = "Tous nos véhicules sont couverts par une assurance complète. Des options supplémentaires sont disponibles lors de la réservation.";
      } else if (lowerMsg.includes("caution") || lowerMsg.includes("dépôt")) {
        response = "Un acompte de 10% est requis lors de la réservation. Le solde est payé à la prise en charge du véhicule.";
      }

      setMessages(prev => [...prev, { role: "bot", content: response, recommendation }]);
    } finally {
      setIsTyping(false);
    }
  };

  return {
    isOpen, setIsOpen,
    messages, input, setInput,
    isTyping, weather,
    scrollRef, handleSend,
    router
  };
}
