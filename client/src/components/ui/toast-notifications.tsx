import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  X,
  AlertTriangle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToastNotifications() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastNotifications must be used within ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after duration
    const duration = toast.duration || 5000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const toastConfig = {
    success: {
      icon: CheckCircle,
      iconColor: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20'
    },
    error: {
      icon: AlertCircle,
      iconColor: 'text-error',
      bgColor: 'bg-error/10',
      borderColor: 'border-error/20'
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20'
    },
    info: {
      icon: Info,
      iconColor: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20'
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast) => {
            const config = toastConfig[toast.type];
            const Icon = config.icon;
            
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 100, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`
                  bg-card/95 backdrop-blur-md border rounded-lg p-4 shadow-lg
                  ${config.bgColor} ${config.borderColor}
                `}
              >
                <div className="flex items-start space-x-3">
                  <Icon className={`h-5 w-5 mt-0.5 ${config.iconColor}`} />
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground">{toast.title}</h4>
                    {toast.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {toast.description}
                      </p>
                    )}
                    
                    {toast.action && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={toast.action.onClick}
                      >
                        {toast.action.label}
                      </Button>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => removeToast(toast.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;