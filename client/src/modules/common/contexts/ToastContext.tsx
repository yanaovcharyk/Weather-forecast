import { createContext } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export type ToastMessage = (text: string) => void;

export interface ToastContextValue {
  toast: (type: ToastType, text: string) => void;
  success: ToastMessage;
  error: ToastMessage;
  info: ToastMessage;
  warning: ToastMessage;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
