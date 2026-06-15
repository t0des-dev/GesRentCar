"use client";

import { useRef, useState, useEffect } from "react";
import { PenTool, RotateCcw, Check, Trash2 } from "lucide-react";
import { cn } from "@/shared/utils";

interface SignaturePadProps {
  onSave: (base64: string) => void;
  onClear?: () => void;
  isLoading?: boolean;
}

export default function SignaturePad({ onSave, onClear, isLoading }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set high resolution
    const ratio = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    ctx.scale(ratio, ratio);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#0f172a"; // Slate 900
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    setIsEmpty(false);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      onSave(canvas.toDataURL("image/png"));
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
    if (onClear) onClear();
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <PenTool size={16} className="text-primary" />
          <span className="text-xs font-black uppercase tracking-widest text-slate-500">Signature Tactile</span>
        </div>
        <button 
          onClick={clear}
          disabled={isLoading}
          className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
        >
          <RotateCcw size={12} />
          Effacer
        </button>
      </div>

      <div className={cn("relative group", isLoading && "opacity-50 cursor-not-allowed")}>
        <canvas
          ref={canvasRef}
          onMouseDown={isLoading ? undefined : startDrawing}
          onMouseMove={isLoading ? undefined : draw}
          onMouseUp={isLoading ? undefined : stopDrawing}
          onMouseOut={isLoading ? undefined : stopDrawing}
          onTouchStart={isLoading ? undefined : startDrawing}
          onTouchMove={isLoading ? undefined : draw}
          onTouchEnd={isLoading ? undefined : stopDrawing}
          className="w-full h-48 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[24px] cursor-crosshair touch-none transition-all group-hover:border-primary/30"
        />
        
        {isEmpty && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-300">
            <PenTool size={32} className="mb-2 opacity-20" />
            <p className="text-xs font-bold uppercase tracking-widest opacity-40">Signez ici</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0">
          <Check size={16} strokeWidth={3} />
        </div>
        <p className="text-[11px] font-bold text-blue-800 leading-tight">
          En signant ici, vous acceptez les conditions générales de location et la politique de protection des données de Vectoria.
        </p>
      </div>
    </div>
  );
}
