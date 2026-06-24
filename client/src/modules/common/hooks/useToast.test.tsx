import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/common/contexts/ToastContext', async () => {
  const React = await import('react');

  type ToastContextType = {
    toast: ReturnType<typeof vi.fn>;
  };

  return {
    ToastContext: React.createContext<ToastContextType | null>(null),
  };
});

import { ToastContext } from '@/common/contexts/ToastContext';
import { useToast } from './useToast';

describe('useToast', () => {
  it('returns toast context value', () => {
    const toast = vi.fn();

    const wrapper = ({ children }: React.PropsWithChildren) => (
      <ToastContext.Provider value={{ toast }}>
        {children}
      </ToastContext.Provider>
    );

    const { result } = renderHook(() => useToast(), {
      wrapper,
    });

    expect(result.current.toast).toBe(toast);
  });

  it('throws without provider', () => {
    expect(() => {
      renderHook(() => useToast());
    }).toThrow('useToast must be used within useToastProvider');
  });
});
