import { act } from 'react';
import { useLogin } from '@/auth/hooks/useLogin';
import { testRenderHook } from '@/common/testing/render/renderWithProviders';

export const setupLogin = () => {
  const renderedHook = testRenderHook(() => useLogin());

  const login = async (email: string, password: string) => {
    await act(async () => {
      await renderedHook.result.current.loginUser({
        email,
        password,
      });
    });
  };

  return {
    ...renderedHook,
    login,
  };
};
