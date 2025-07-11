import * as React from "react"
import { cn } from "@/lib/utils"

interface ResponsiveContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  center?: boolean
  fluid?: boolean
}

const ResponsiveContainer = React.forwardRef<HTMLDivElement, ResponsiveContainerProps>(
  ({ 
    className, 
    maxWidth = 'lg',
    padding = 'md',
    center = true,
    fluid = false,
    children,
    ...props 
  }, ref) => {
    const maxWidthClasses = {
      sm: "max-w-sm",
      md: "max-w-md", 
      lg: "max-w-lg",
      xl: "max-w-xl",
      '2xl': "max-w-2xl",
      '3xl': "max-w-3xl",
      '4xl': "max-w-4xl",
      '5xl': "max-w-5xl",
      '6xl': "max-w-6xl",
      '7xl': "max-w-7xl",
      full: "max-w-full"
    }

    const paddingClasses = {
      none: "",
      sm: "px-2 py-1 sm:px-4 sm:py-2",
      md: "px-4 py-2 sm:px-6 sm:py-4 lg:px-8 lg:py-6",
      lg: "px-6 py-4 sm:px-8 sm:py-6 lg:px-12 lg:py-8",
      xl: "px-8 py-6 sm:px-12 sm:py-8 lg:px-16 lg:py-12"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "w-full",
          !fluid && maxWidthClasses[maxWidth],
          center && "mx-auto",
          paddingClasses[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

ResponsiveContainer.displayName = "ResponsiveContainer"

export { ResponsiveContainer }