import { 
  type ToastActionElement, 
  type ToastProps 
} from "@/components/ui/toast";
import * as React from "react";

type ToastType = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

type ToastContextType = {
  toasts: ToastType[];
  toast: (props: Omit<ToastType, "id">) => void;
  dismiss: (toastId: string) => void;
};

const ToastContext = React.createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastType[]>([]);

  function toast(props: Omit<ToastType, "id">) {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, ...props }]);
    
    // Auto dismiss after 5 seconds unless it's an error
    if (props.variant !== 'destructive') {
      setTimeout(() => {
        dismiss(id);
      }, 5000);
    }
  }

  function dismiss(toastId: string) {
    setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
  }

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  
  return context;
}