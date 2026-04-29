import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

import { LOGIN_MUTATION } from '../api';
import type { LoginFormValues, LoginMutationResponse } from '../types';
import { useAuth } from './useAuth';
import { extractErrorCode, mapErrorCodeToMessage } from '../../common/utils';

export const useLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loginMutation, { loading }] = useMutation<LoginMutationResponse>(
    LOGIN_MUTATION,
    {
      errorPolicy: 'all',
    },
  );

  const loginUser = async (values: LoginFormValues) => {
    try {
      const { data } = await loginMutation({
        variables: { input: values },
      });

      if (!data?.login?.success) {
        message.error('Invalid email or password');
        return;
      }

      login();
      message.success('Logged in successfully');
      navigate('/');
    } catch (err) {
      message.error(mapErrorCodeToMessage(extractErrorCode(err)));
    }
  };

  return {
    loginUser,
    loading,
  };
};
