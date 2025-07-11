import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Wifi, 
  WifiOff,
  Loader2 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusIndicatorProps {
  status: 'success' | 'error' | 'warning' | 'loading' | 'connected' | 'disconnected';
  message?: string;
  showText?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusIndicator({ 
  status, 
  message, 
  showText = false, 
  className,
  size = 'md'
}: StatusIndicatorProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4', 
    lg: 'h-5 w-5'
  };

  const statusConfig = {
    success: {
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20',
      text: message || 'Success'
    },
    error: {
      icon: AlertCircle,
      color: 'text-error',
      bgColor: 'bg-error/10',
      borderColor: 'border-error/20',
      text: message || 'Error'
    },
    warning: {
      icon: AlertCircle,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20',
      text: message || 'Warning'
    },
    loading: {
      icon: Loader2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
      text: message || 'Loading...'
    },
    connected: {
      icon: Wifi,
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20',
      text: message || 'Connected'
    },
    disconnected: {
      icon: WifiOff,
      color: 'text-error',
      bgColor: 'bg-error/10',
      borderColor: 'border-error/20',
      text: message || 'Disconnected'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={cn(
        'flex items-center space-x-2',
        showText && 'px-3 py-2 rounded-md border',
        showText && config.bgColor,
        showText && config.borderColor,
        className
      )}
    >
      <motion.div
        animate={status === 'loading' ? { rotate: 360 } : {}}
        transition={status === 'loading' ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
      >
        <Icon className={cn(sizeClasses[size], config.color)} />
      </motion.div>
      
      {showText && (
        <span className={cn('text-sm font-medium', config.color)}>
          {config.text}
        </span>
      )}
    </motion.div>
  );
}

export default StatusIndicator;