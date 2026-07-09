import { App } from 'antd';
import { useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { ToastContext, type ToastType } from '@/common/contexts/ToastContext';

export const ToastProvider = ({ children }: { children?: ReactNode }) => {
  const { message } = App.useApp();

  const toast = useCallback(
    (type: ToastType, text: string) => {
      message[type](text);
    },
    [message],
  );

  const toastApi = useMemo(
    () => ({
      toast,
      success: (text: string) => toast('success', text),
      error: (text: string) => toast('error', text),
      info: (text: string) => toast('info', text),
      warning: (text: string) => toast('warning', text),
    }),
    [toast],
  );

  return (
    <ToastContext.Provider value={toastApi}>{children}</ToastContext.Provider>
  );
};
