import { createContext } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastContextValue {
  toast: (type: ToastType, text: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
