import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    '2xl'?: number
  }
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  animate?: boolean
  staggerChildren?: number
}

const ResponsiveGrid = React.forwardRef<HTMLDivElement, ResponsiveGridProps>(
  ({ 
    className, 
    cols = { default: 1, sm: 2, md: 3, lg: 4 },
    gap = 'md',
    animate = true,
    staggerChildren = 0.1,
    children,
    ...props 
  }, ref) => {
    const gapClasses = {
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8"
    }

    const getGridCols = () => {
      const classes = []
      if (cols.default) classes.push(`grid-cols-${cols.default}`)
      if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`)
      if (cols.md) classes.push(`md:grid-cols-${cols.md}`)
      if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`)
      if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`)
      if (cols['2xl']) classes.push(`2xl:grid-cols-${cols['2xl']}`)
      return classes.join(' ')
    }

    const containerVariants = {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: staggerChildren
        }
      }
    }

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }

    if (animate) {
      return (
        <motion.div
          ref={ref}
          className={cn(
            "grid w-full",
            getGridCols(),
            gapClasses[gap],
            className
          )}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          {...props}
        >
          {React.Children.map(children, (child, index) => (
            <motion.div key={index} variants={itemVariants}>
              {child}
            </motion.div>
          ))}
        </motion.div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          "grid w-full",
          getGridCols(),
          gapClasses[gap],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

ResponsiveGrid.displayName = "ResponsiveGrid"

export { ResponsiveGrid }