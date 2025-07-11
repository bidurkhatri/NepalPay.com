import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'loading' | 'error'
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  status, 
  size = 'md', 
  showText = false,
  className 
}) => {
  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4"
  }

  const statusConfig = {
    online: {
      color: "bg-green-500",
      text: "Online",
      animate: true
    },
    offline: {
      color: "bg-red-500",
      text: "Offline",
      animate: false
    },
    loading: {
      color: "bg-yellow-500",
      text: "Connecting...",
      animate: true
    },
    error: {
      color: "bg-red-500",
      text: "Error",
      animate: false
    }
  }

  const config = statusConfig[status]

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <motion.div
        className={cn(
          "rounded-full",
          sizeClasses[size],
          config.color
        )}
        animate={config.animate ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {showText && (
        <span className="text-sm font-medium text-muted-foreground">
          {config.text}
        </span>
      )}
    </div>
  )
}

export { StatusIndicator }