import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/common/hooks/useToast';
import { LOGIN_MUTATION } from '@/auth/graphql';
import type { ILoginMutationResponse } from '@/auth/types';
import { useAuth } from './useAuth';
import { extractErrorCode, mapErrorCodeToMessage } from '@/common/utils';
import type { LoginFormInput } from '@/auth/validation';

export const useLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loginMutation, { loading }] = useMutation<ILoginMutationResponse>(
    LOGIN_MUTATION,
    {
      errorPolicy: 'all',
    },
  );

  const loginUser = async (values: LoginFormInput) => {
    try {
      const { data } = await loginMutation({
        variables: { input: values },
      });

      if (!data?.login?.success) {
        toast('error', 'Invalid email or password');
        return;
      }

      login();
      toast('success', 'Logged in successfully');
      navigate('/');
    } catch (err) {
      toast('error', mapErrorCodeToMessage(extractErrorCode(err)));
    }
  };

  return {
    loginUser,
    loading,
  };
};
