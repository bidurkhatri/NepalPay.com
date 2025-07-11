import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'gradient' | 'glow'
  animation?: 'none' | 'fade' | 'slide' | 'scale' | 'bounce'
  delay?: number
  hover?: boolean
  interactive?: boolean
}

const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ 
    className, 
    variant = 'default',
    animation = 'fade',
    delay = 0,
    hover = true,
    interactive = true,
    children,
    ...props 
  }, ref) => {
    const variantClasses = {
      default: "bg-card border border-border",
      elevated: "bg-card border border-border shadow-lg shadow-primary/10",
      glass: "bg-card/80 backdrop-blur-md border border-border/50 shadow-2xl shadow-primary/20",
      gradient: "bg-gradient-to-br from-card to-card/90 border border-border/60 shadow-lg shadow-primary/15",
      glow: "bg-card border border-primary/30 shadow-lg shadow-primary/25 ring-1 ring-primary/20"
    }

    const animationVariants = {
      none: {},
      fade: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay }
      },
      slide: {
        initial: { opacity: 0, x: -50 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.4, delay, type: "spring", stiffness: 100 }
      },
      scale: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.3, delay, type: "spring", stiffness: 120 }
      },
      bounce: {
        initial: { opacity: 0, scale: 0.3 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.6, delay, type: "spring", stiffness: 260, damping: 20 }
      }
    }

    const hoverVariants = hover ? {
      whileHover: { 
        scale: 1.02,
        y: -2,
        transition: { duration: 0.2 }
      },
      whileTap: interactive ? { scale: 0.98 } : {}
    } : {}

    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-lg p-6 transition-all duration-300 ease-in-out",
          variantClasses[variant],
          interactive && "cursor-pointer",
          hover && "hover:shadow-xl hover:shadow-primary/30",
          className
        )}
        {...animationVariants[animation]}
        {...hoverVariants}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

AnimatedCard.displayName = "AnimatedCard"

export { AnimatedCard }