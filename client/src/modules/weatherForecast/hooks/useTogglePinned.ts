import { useMutation } from '@apollo/client/react';
import { UPDATE_CITY_MUTATION } from '@/weatherForecast/graphql';

export type UpdateCityMutation = {
  updateCity: {
    __typename: 'CityOutput';
    id: string;
    isPinned: boolean;
  };
};

export type UpdateCityVariables = {
  id: string;
  input: {
    isPinned: boolean;
  };
};

export const useTogglePinned = () => {
  const [toggleCityPinMutation, { loading }] = useMutation<
    UpdateCityMutation,
    UpdateCityVariables
  >(UPDATE_CITY_MUTATION);

  const togglePinned = async (id: string, currentPinned: boolean) => {
    await toggleCityPinMutation({
      variables: {
        id,
        input: {
          isPinned: !currentPinned,
        },
      },

      optimisticResponse: {
        updateCity: {
          __typename: 'CityOutput',
          id,
          isPinned: !currentPinned,
        },
      },

      update(cache, { data }) {
        const city = data?.updateCity;
        if (!city) {
          return;
        }

        cache.modify({
          id: cache.identify({
            __typename: 'CityOutput',
            id: city.id,
          }),
          fields: {
            isPinned() {
              return city.isPinned;
            },
          },
        });
      },
    });
  };

  return {
    togglePinned,
    loading,
  };
};
