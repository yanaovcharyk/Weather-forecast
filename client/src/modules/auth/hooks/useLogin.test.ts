import { renderHook, act } from '@testing-library/react';
import { useLogin } from './useLogin';
import { vi } from 'vitest';

import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/common/hooks/useToast';
import { useAuth } from './useAuth';

vi.mock('@apollo/client/react');
vi.mock('react-router-dom');
vi.mock('@/common/hooks/useToast');
vi.mock('./useAuth');

describe('useLogin', () => {
  const mockLogin = vi.fn();
  const mockNavigate = vi.fn();
  const mockToast = vi.fn();
  const mockMutation = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      login: mockLogin,
    });

    (useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockNavigate,
    );

    (useToast as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      toast: mockToast,
    });

    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
      mockMutation,
      { loading: false },
    ]);
  });

  it('success login flow', async () => {
    mockMutation.mockResolvedValue({
      data: {
        login: { success: true },
      },
    });

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.loginUser({
        email: 'test@test.com',
        password: '123',
      });
    });

    expect(mockLogin).toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledWith('success', 'Logged in successfully');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('invalid credentials', async () => {
    mockMutation.mockResolvedValue({
      data: {
        login: { success: false },
      },
    });

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.loginUser({
        email: 'test@test.com',
        password: 'wrong',
      });
    });

    expect(mockToast).toHaveBeenCalledWith(
      'error',
      'Invalid email or password',
    );

    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('graphql error', async () => {
    mockMutation.mockRejectedValue(new Error('network error'));

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.loginUser({
        email: 'test@test.com',
        password: '123',
      });
    });

    expect(mockToast).toHaveBeenCalledWith('error', expect.any(String));
  });
});
