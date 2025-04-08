import { 
  Toast,
  ToastActionElement,
  ToastProps
} from "@/components/ui/toast";
import {
  useToast as useToastOriginal,
} from "@/components/ui/use-toast";

export type ToastVariant = "default" | "destructive" | "success" | "warning" | "info";

type ToastOptions = Partial<
  Pick<Toast, "id" | "duration" | "className"> & {
    variant: ToastVariant;
    action: ToastActionElement;
  }
>;

// Re-export the toast hook from shadcn
export const useToast = useToastOriginal;

// Add custom variants - we'll implement these in the toast component
export type { Toast, ToastProps, ToastOptions };