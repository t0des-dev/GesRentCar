// Centralized animation presets for Framer Motion
export const spring = {
  gentle: { type: "spring" as const, stiffness: 200, damping: 25 },
  snappy: { type: "spring" as const, stiffness: 300, damping: 30 },
  bouncy: { type: "spring" as const, stiffness: 400, damping: 30 },
  slow: { type: "spring" as const, stiffness: 80, damping: 20 },
};

export const ease = {
  smooth: [0.22, 1, 0.36, 1] as const,
  fast: [0.16, 1, 0.3, 1] as const,
  standard: [0.25, 0.1, 0.25, 1] as const,
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export const stagger = {
  container: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  },
  item: {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0 },
  },
};

// Common button interaction presets
export const buttonHover = { scale: 1.02 };
export const buttonTap = { scale: 0.98 };
export const iconButtonHover = { scale: 1.05 };
export const iconButtonTap = { scale: 0.95 };
