import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4 w-full max-w-sm">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          onDismiss={() => dismiss(toast.id)}
        />
      ))}
    </div>
  );
}

interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  onDismiss: () => void;
}

function Toast({ title, description, variant = 'default', onDismiss }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`transform transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div
        className={`p-4 rounded-lg shadow-lg glass-card flex gap-3 ${
          variant === 'destructive' ? 'border-destructive/30 bg-destructive/10' : 'border-border'
        }`}
      >
        <div className="flex-1">
          {title && (
            <h3 className={`font-medium ${variant === 'destructive' ? 'text-destructive' : ''}`}>
              {title}
            </h3>
          )}
          {description && (
            <div className="mt-1 text-sm text-muted-foreground">{description}</div>
          )}
        </div>
        <button
          onClick={onDismiss}
          className={`self-start p-1 rounded-full hover:bg-background ${
            variant === 'destructive' ? 'text-destructive' : 'text-muted-foreground'
          }`}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}