import { useMutation } from '@apollo/client/react';
import { REMOVE_CITY_MUTATION } from '../api/weatherApi';
import type { Reference } from '@apollo/client';
import type { StoreObject } from '@apollo/client';
import type { RemoveCityMutation, RemoveCityVariables } from '../types';

let mutationQueue: Promise<unknown> = Promise.resolve();

const queueMutation = <T>(fn: () => Promise<T>): Promise<T> => {
  const result = mutationQueue.then(fn);
  mutationQueue = result.catch(() => {});
  return result;
};

export const useRemoveCity = () => {
  const [mutate, { loading, error }] = useMutation<
    RemoveCityMutation,
    RemoveCityVariables
  >(REMOVE_CITY_MUTATION);

  const removeCity = async (id: number): Promise<void> => {
    await queueMutation(() =>
      mutate({
        variables: { id },

        optimisticResponse: {
          removeCity: {
            id,
            __typename: 'City',
          },
        },

        update(cache, { data }) {
          const removedId = data?.removeCity.id;
          if (!removedId) return;

          cache.modify({
            fields: {
              cities(existingCities = [], { readField }) {
                return existingCities.filter(
                  (cityRef: Reference | StoreObject | undefined) =>
                    readField('id', cityRef) !== removedId,
                );
              },
            },
          });
        },
      }),
    );
  };

  return {
    removeCity,
    loading,
    error,
  };
};
