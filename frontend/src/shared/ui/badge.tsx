import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/shared/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border border-border bg-surface-1 text-foreground hover:bg-surface-2",
        primary: "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15",
        secondary: "bg-secondary text-secondary-foreground",
        destructive:
          "border border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border border-foreground/20",
        success: "bg-emerald-50 text-emerald-700 border border-emerald-200/50",
        warning: "bg-amber-50 text-amber-700 border border-amber-200/50",
        gold: "bg-gold-light text-gold-dark border border-gold/30 hover:border-gold/50",
        "gold-glow": "bg-gold/15 text-gold border border-gold/40 shadow-sm shadow-gold/20 hover:shadow-md hover:shadow-gold/30",
        luxury: "bg-gradient-to-r from-gold/10 to-gold/5 text-gold border border-gold/30 hover:border-gold/60 hover:shadow-sm hover:shadow-gold/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
