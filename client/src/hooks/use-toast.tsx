import React, { createContext, useContext, useState } from 'react';

type ToastVariant = 'default' | 'destructive';

type ToastProps = {
  title?: string;
  description?: string;
  duration?: number;
  variant?: ToastVariant;
  onClose?: () => void;
};

type Toast = {
  id: string;
  title?: string;
  description?: string;
  duration: number;
  variant: ToastVariant;
  onClose?: () => void;
};

type ToasterContextType = {
  toasts: Toast[];
  toast: (props: ToastProps) => void;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToasterContextType | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (props: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      id,
      title: props.title,
      description: props.description,
      duration: props.duration || 5000,
      variant: props.variant || 'default',
      onClose: props.onClose,
    };

    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Auto dismiss after duration
    setTimeout(() => {
      dismiss(id);
    }, newToast.duration);

    return id;
  };

  const dismiss = (id: string) => {
    setToasts((prevToasts) => {
      const toast = prevToasts.find((t) => t.id === id);
      if (toast?.onClose) {
        toast.onClose();
      }
      return prevToasts.filter((t) => t.id !== id);
    });
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};