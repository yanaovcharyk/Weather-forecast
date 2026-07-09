import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/common/contexts/ToastContext', async () => {
  const React = await import('react');

  type ToastContextType = {
    toast: ReturnType<typeof vi.fn>;
    success: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
    info: ReturnType<typeof vi.fn>;
    warning: ReturnType<typeof vi.fn>;
  };

  return {
    ToastContext: React.createContext<ToastContextType | null>(null),
  };
});

import { ToastContext } from '@/common/contexts/ToastContext';
import { useToast } from './useToast';

describe('useToast', () => {
  it('returns toast context value', () => {
    const toastApi = {
      toast: vi.fn(),
      success: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
      warning: vi.fn(),
    };

    const wrapper = ({ children }: React.PropsWithChildren) => (
      <ToastContext.Provider value={toastApi}>{children}</ToastContext.Provider>
    );

    const { result } = renderHook(() => useToast(), {
      wrapper,
    });

    expect(result.current).toBe(toastApi);
  });

  it('throws without provider', () => {
    expect(() => {
      renderHook(() => useToast());
    }).toThrow('useToast must be used within useToastProvider');
  });
});
