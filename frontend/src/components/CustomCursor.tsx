"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [hoverText, setHoverText] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 250 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const hoverData = target.closest("[data-cursor]");
      
      if (hoverData) {
        setIsHovering(true);
        setHoverText(hoverData.getAttribute("data-cursor") || "");
      } else if (target.closest("button, a")) {
        setIsHovering(true);
        setHoverText("");
      } else {
        setIsHovering(false);
        setHoverText("");
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isVisible]);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null; // Disable on touch devices
  }

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] mix-blend-difference hidden md:flex items-center justify-center"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      <motion.div
        animate={{
          scale: isHovering ? (hoverText ? 4 : 1.5) : 1,
          backgroundColor: isHovering ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.8)",
        }}
        className="w-full h-full rounded-full flex items-center justify-center overflow-hidden"
      >
        {hoverText && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[3px] font-black uppercase tracking-tighter text-black"
          >
            {hoverText}
          </motion.span>
        )}
      </motion.div>
      
      {/* Outer ring */}
      <motion.div 
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0 : 0.5
        }}
        className="absolute inset-0 border border-white rounded-full"
      />
    </motion.div>
  );
}
