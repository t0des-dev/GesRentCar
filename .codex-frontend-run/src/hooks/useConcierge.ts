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

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setIsTyping(true);

    // Simulate AI logic
    setTimeout(() => {
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
      }

      if ((lowerMsg.includes("météo") || lowerMsg.includes("temps") || lowerMsg.includes("atlas")) && weather) {
        if (weather.condition.includes("Pluvieux") || weather.condition.includes("Neigeux")) {
          response = `D'après mes capteurs, le temps est ${weather.condition.toLowerCase()} (${weather.temp}°C). Je vous recommande fortement un véhicule 4x4 pour une sécurité maximale sur les routes glissantes ou enneigées.`;
          recommendation = { id: "2", brand: "Range Rover", model: "Autobiography", price: 4500, reason: "Suspension adaptative et transmission intégrale de pointe pour affronter les intempéries." };
        } else {
          response = `Il fait actuellement ${weather.temp}°C et le ciel est ${weather.condition.toLowerCase()}. C'est le moment idéal pour profiter d'un cabriolet ou d'un véhicule de luxe.`;
        }
      }

      setMessages(prev => [...prev, { role: "bot", content: response, recommendation }]);
      setIsTyping(false);
    }, 1500);
  };

  return {
    isOpen, setIsOpen,
    messages, input, setInput,
    isTyping, weather,
    scrollRef, handleSend,
    router
  };
}
