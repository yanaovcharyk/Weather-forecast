import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/common/hooks/useToast';
import { LOGIN_MUTATION } from '@/auth/graphql';
import type { ILoginMutationResponse } from '@/auth/types';
import { useAuthContext } from '@/auth/contexts/AuthContext';
import { extractErrorCode, mapErrorCodeToMessage } from '@/common/utils';
import type { LoginFormInput } from '@/auth/validation';

export const useLogin = () => {
  const { refreshSession } = useAuthContext();
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

      await refreshSession();
      toast('success', 'Logged in successfully');
      navigate('/');
    } catch (error) {
      toast('error', mapErrorCodeToMessage(extractErrorCode(error)));
    }
  };

  return {
    loginUser,
    loading,
  };
};
