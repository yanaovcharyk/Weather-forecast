import { App } from 'antd';
import type { ReactNode } from 'react';
import { ToastContext, type ToastType } from '@/common/contexts/ToastContext';

export const ToastProvider = ({ children }: { children?: ReactNode }) => {
  const { message } = App.useApp();

  const toast = (type: ToastType, text: string) => {
    message[type](text);
  };

  return (
    <ToastContext.Provider value={{ toast }}>{children}</ToastContext.Provider>
  );
};
