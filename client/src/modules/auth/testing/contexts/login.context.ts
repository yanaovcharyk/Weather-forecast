import { vi } from 'vitest';
import type { ToastContextValue } from '@/common/contexts/ToastContext';

export const createLoginContext = () => ({
  mutate: vi.fn(),
  refreshSession: vi.fn(),
  navigate: vi.fn(),
  toast: {
    toast: vi.fn<ToastContextValue['toast']>(),
    success: vi.fn<ToastContextValue['success']>(),
    error: vi.fn<ToastContextValue['error']>(),
    info: vi.fn<ToastContextValue['info']>(),
    warning: vi.fn<ToastContextValue['warning']>(),
  },
});

export type LoginContext = ReturnType<typeof createLoginContext>;
