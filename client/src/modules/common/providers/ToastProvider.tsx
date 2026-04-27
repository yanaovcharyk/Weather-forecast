import { message } from 'antd';
import { ToastContext, type ToastType } from '../contexts/ToastContext';

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const toast = (type: ToastType, text: string) => {
    message[type](text);
  };

  return (
    <ToastContext.Provider value={{ toast }}>{children}</ToastContext.Provider>
  );
};
