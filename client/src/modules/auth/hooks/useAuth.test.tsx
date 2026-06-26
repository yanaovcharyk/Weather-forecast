import { testRenderHook } from '@/common/testing/render/renderWithProviders';
import { useAuth } from './useAuth';

describe('useAuth', () => {
  it('returns context value', () => {
    const { result } = testRenderHook(() => useAuth(), {
      auth: {
        isAuthenticated: true,
        loading: false,
      },
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.loading).toBe(false);
  });
});
