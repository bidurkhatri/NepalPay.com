import { useToast } from '@/hooks/use-toast';

// Type definitions
export type ToastVariantType = 'default' | 'destructive' | 'success';

interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariantType;
}

// Create a wrapper for the toast function that maps any "success" variant to "default"
export const useCustomToast = () => {
  const { toast: originalToast } = useToast();
  
  const toast = (options: ToastOptions) => {
    // Map 'success' variant to 'default' to avoid type errors
    const variant = options.variant === 'success' ? 'default' : options.variant;
    
    return originalToast({
      ...options,
      variant
    });
  };
  
  return toast;
};