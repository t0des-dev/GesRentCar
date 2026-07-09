"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  RotateCw,
} from "lucide-react";
import { cn } from "@/shared/utils";

interface Vehicle360ViewerProps {
  images: string[];
  alt?: string;
}

export default function Vehicle360Viewer({ images, alt = "Vehicle" }: Vehicle360ViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);

  const goTo = (index: number) => {
    setCurrentIndex((index + images.length) % images.length);
  };

  const handleDragStart = useCallback((clientX: number) => {
    setIsDragging(true);
    dragStartX.current = clientX;
  }, []);

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - dragStartX.current;
    const threshold = 50;
    if (Math.abs(diff) > threshold) {
      if (diff > 0) goTo(currentIndex - 1);
      else goTo(currentIndex + 1);
      dragStartX.current = clientX;
    }
    setRotation(prev => prev + diff * 0.5);
  }, [isDragging, currentIndex]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setRotation(0);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onMouseDown = (e: MouseEvent) => handleDragStart(e.clientX);
    const onMouseMove = (e: MouseEvent) => handleDragMove(e.clientX);
    const onMouseUp = () => handleDragEnd();

    const onTouchStart = (e: TouchEvent) => handleDragStart(e.touches[0].clientX);
    const onTouchMove = (e: TouchEvent) => handleDragMove(e.touches[0].clientX);
    const onTouchEnd = () => handleDragEnd();

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("touchend", onTouchEnd);

    return () => {
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, [handleDragStart, handleDragMove, handleDragEnd]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(currentIndex - 1);
      if (e.key === "ArrowRight") goTo(currentIndex + 1);
      if (e.key === "Escape") setIsFullscreen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  if (!images.length) {
    return (
      <div className="bg-surface-1 border border-border rounded-2xl p-20 text-center">
        <p className="text-ink-3 text-sm font-bold">Aucune image disponible</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative bg-surface-1 border border-border rounded-2xl overflow-hidden select-none",
        isFullscreen ? "fixed inset-0 z-50 rounded-none" : "",
        isDragging ? "cursor-grabbing" : "cursor-grab"
      )}
    >
      <div className="relative aspect-video flex items-center justify-center overflow-hidden">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`${alt} ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1, rotate: isDragging ? rotation * 0.02 : 0 }}
          transition={{ duration: 0.3 }}
          draggable={false}
        />

        <button
          onClick={() => goTo(currentIndex - 1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
        >
          <ChevronLeft size={18} className="text-ink-1" />
        </button>

        <button
          onClick={() => goTo(currentIndex + 1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
        >
          <ChevronRight size={18} className="text-ink-1" />
        </button>

        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={() => goTo((currentIndex + 1) % images.length)}
            className="w-8 h-8 rounded-lg bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
            title="Rotation automatique"
          >
            <RotateCw size={14} className="text-ink-2" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="w-8 h-8 rounded-lg bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
            title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
          >
            {isFullscreen ? <Minimize2 size={14} className="text-ink-2" /> : <Maximize2 size={14} className="text-ink-2" />}
          </button>
        </div>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full">
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 p-4">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              i === currentIndex ? "bg-primary w-6" : "bg-ink-3/30 hover:bg-ink-3/50"
            )}
          />
        ))}
      </div>

      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full pointer-events-none">
        <span className="text-[9px] font-bold text-white/70 uppercase tracking-widest">Glissez pour tourner</span>
      </div>
    </div>
  );
}
