import { act } from 'react';
import { useLogin } from '@/auth/hooks/useLogin';
import { testRenderHook } from '@/common/test/render/renderWithProviders';

export const setupLogin = () => {
  const hook = testRenderHook(() => useLogin());

  const login = async (email: string, password: string) => {
    await act(async () => {
      await hook.result.current.loginUser({
        email,
        password,
      });
    });
  };

  return {
    ...hook,
    login,
  };
};
