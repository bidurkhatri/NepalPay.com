import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

interface EnhancedSwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  label?: string
  description?: string
  showLabels?: boolean
  onLabel?: string
  offLabel?: string
}

const EnhancedSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  EnhancedSwitchProps
>(({ 
  className, 
  variant = 'default', 
  size = 'md', 
  label, 
  description, 
  showLabels = false,
  onLabel = "ON",
  offLabel = "OFF",
  checked,
  ...props 
}, ref) => {
  const sizeClasses = {
    sm: "h-4 w-8",
    md: "h-6 w-11", 
    lg: "h-8 w-14"
  }

  const thumbSizeClasses = {
    sm: "h-3 w-3 data-[state=checked]:translate-x-4",
    md: "h-5 w-5 data-[state=checked]:translate-x-5",
    lg: "h-7 w-7 data-[state=checked]:translate-x-6"
  }

  const variantClasses = {
    default: "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
    success: "data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-input",
    warning: "data-[state=checked]:bg-yellow-500 data-[state=unchecked]:bg-input",
    danger: "data-[state=checked]:bg-red-500 data-[state=unchecked]:bg-input",
    info: "data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-input"
  }

  const labelSizeClasses = {
    sm: "text-[10px] px-1",
    md: "text-xs px-1.5",
    lg: "text-sm px-2"
  }

  return (
    <div className="flex flex-col space-y-2">
      {label && (
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-medium text-foreground">{label}</span>
          {description && (
            <span className="text-xs text-muted-foreground">{description}</span>
          )}
        </div>
      )}
      <div className="flex items-center space-x-2">
        <SwitchPrimitives.Root
          className={cn(
            "peer relative inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-300 ease-in-out",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "hover:shadow-lg hover:shadow-primary/25",
            "data-[state=checked]:shadow-md data-[state=checked]:shadow-primary/30",
            sizeClasses[size],
            variantClasses[variant],
            className
          )}
          {...props}
          ref={ref}
          checked={checked}
        >
          <SwitchPrimitives.Thumb
            className={cn(
              "pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-all duration-300 ease-in-out",
              "data-[state=checked]:bg-white data-[state=unchecked]:bg-white/90",
              "relative flex items-center justify-center",
              thumbSizeClasses[size]
            )}
          >
            {showLabels && (
              <span className={cn(
                "absolute font-bold text-primary transition-all duration-300",
                labelSizeClasses[size],
                checked ? "opacity-100" : "opacity-0"
              )}>
                {checked ? onLabel : offLabel}
              </span>
            )}
          </SwitchPrimitives.Thumb>
        </SwitchPrimitives.Root>
        {!label && showLabels && (
          <span className={cn(
            "text-sm font-medium transition-colors duration-300",
            checked ? "text-primary" : "text-muted-foreground"
          )}>
            {checked ? onLabel : offLabel}
          </span>
        )}
      </div>
    </div>
  )
})

EnhancedSwitch.displayName = "EnhancedSwitch"

export { EnhancedSwitch }