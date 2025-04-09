import { useState, useEffect, useCallback } from 'react';

// Constants for toast configuration
const TOAST_REMOVE_DELAY = 1000;

// Types for toast functionality
export type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success';
};

// Custom hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  // Function to create a new toast
  const toast = useCallback(
    ({ title, description, action, variant = 'default' }: Omit<ToastProps, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast = {
        id,
        title,
        description,
        action,
        variant,
      };

      setToasts((prevToasts) => [...prevToasts, newToast]);

      return {
        id,
        dismiss: () => dismissToast(id),
        update: (props: Omit<ToastProps, 'id'>) => {
          setToasts((prevToasts) =>
            prevToasts.map((toast) =>
              toast.id === id ? { ...toast, ...props } : toast
            )
          );
        },
      };
    },
    []
  );

  // Function to dismiss a toast
  const dismissToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  // Automatically clean up toasts after they're dismissed
  useEffect(() => {
    const toastTimeouts: NodeJS.Timeout[] = [];

    return () => {
      toastTimeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [toasts]);

  return {
    toast,
    dismissToast,
    toasts,
  };
}