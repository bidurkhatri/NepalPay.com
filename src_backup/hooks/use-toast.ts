// Forked from shadcn-ui/ui/use-toast.tsx
import { useState, useEffect } from 'react';

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000000;

export type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive';
};

type ToasterToast = ToastProps & {
  remove: () => void;
};

type ToastState = {
  toasts: ToasterToast[];
};

const toastState: ToastState = { toasts: [] };

// Action types
type ActionType = {
  type: 'ADD_TOAST' | 'UPDATE_TOAST' | 'DISMISS_TOAST' | 'REMOVE_TOAST';
  toast?: ToasterToast;
  id?: string;
};

let listeners: ((state: ToastState) => void)[] = [];

function dispatch(action: ActionType) {
  switch (action.type) {
    case 'ADD_TOAST':
      toastState.toasts = [action.toast!, ...toastState.toasts].slice(0, TOAST_LIMIT);
      break;
    case 'UPDATE_TOAST':
      toastState.toasts = toastState.toasts.map((t) => (t.id === action.id ? { ...t, ...action.toast } : t));
      break;
    case 'DISMISS_TOAST':
      toastState.toasts = toastState.toasts.map((t) =>
        t.id === action.id ? { ...t } : t
      );
      break;
    case 'REMOVE_TOAST':
      toastState.toasts = toastState.toasts.filter((t) => t.id !== action.id);
      break;
  }

  listeners.forEach((listener) => listener(toastState));
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export function toast(props: Omit<ToastProps, 'id'>) {
  const id = generateId();

  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', id });
  const remove = () => dispatch({ type: 'REMOVE_TOAST', id });

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      id,
      remove,
    },
  });

  setTimeout(remove, TOAST_REMOVE_DELAY);

  return {
    id,
    dismiss,
    remove,
  };
}

export function useToast() {
  const [toasts, setToasts] = useState<ToasterToast[]>([]);

  useEffect(() => {
    setToasts(toastState.toasts);

    const listener = (state: ToastState) => {
      setToasts(state.toasts);
    };

    listeners.push(listener);

    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return {
    toast,
    toasts,
    dismiss: (id: string) => dispatch({ type: 'DISMISS_TOAST', id }),
  };
}