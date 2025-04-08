// Toast variant types for consistency across the application
export type ToastVariant = 'default' | 'destructive' | 'success' | null | undefined;

// Helper functions to ensure type safety for toast variants
export const toastVariants = {
  default: 'default' as ToastVariant,
  destructive: 'destructive' as ToastVariant,
  success: 'default' as ToastVariant, // Map success to default for compatibility
};