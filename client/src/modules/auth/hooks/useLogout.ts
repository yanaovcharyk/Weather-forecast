import { useMutation } from '@apollo/client/react';
import { LOGOUT_MUTATION } from '@/auth/graphql';

export const useLogout = () => {
  const [logoutMutation] = useMutation(LOGOUT_MUTATION);

  const logout = async () => {
    await logoutMutation();
  };

  return logout;
};
