import { useMutation } from '@apollo/client/react';
import { GraphQLError } from 'graphql';
import { REMOVE_ALL_CITIES } from '../api/weatherApi';

export const useRemoveAllCities = () => {
  const [mutate, { loading }] = useMutation(REMOVE_ALL_CITIES);

  const removeAllCities = async () => {
    try {
      await mutate({
        refetchQueries: ['CitiesPaginated'],
      });

      return { ok: true as const };
    } catch (error) {
      const gqlErrors = error as readonly GraphQLError[];
      const code = gqlErrors[0]?.extensions?.code as string | undefined;

      return { ok: false as const, code };
    }
  };

  return { removeAllCities, loading };
};
