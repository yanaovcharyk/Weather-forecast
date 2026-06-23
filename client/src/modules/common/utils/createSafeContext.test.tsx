import { createContext } from 'react';
import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';

import { createSafeContext } from './createSafeContext';

describe('createSafeContext', () => {
  const TestContext = createContext<string | null>(null);
  const useSafe = createSafeContext(TestContext, 'useTest');

  it('returns context value when provider exists', () => {
    const wrapper = ({ children }: React.PropsWithChildren) => (
      <TestContext.Provider value="hello">{children}</TestContext.Provider>
    );

    const { result } = renderHook(() => useSafe(), { wrapper });

    expect(result.current).toBe('hello');
  });

  it('throws when provider does not exist', () => {
    expect(() => {
      renderHook(() => useSafe());
    }).toThrow('useTest must be used within useTestProvider');
  });
});
