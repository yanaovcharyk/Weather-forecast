import { useMutation } from '@apollo/client/react';
import { TOGGLE_CITY_PIN } from '../graphql';

export type ToggleCityPinMutation = {
  togglePinnedCity: {
    __typename: 'CityOutput';
    id: string;
    isPinned: boolean;
  };
};

export type ToggleCityPinVariables = {
  id: string;
};

export const useTogglePinned = () => {
  const [toggleCityPinMutation, { loading }] = useMutation<
    ToggleCityPinMutation,
    ToggleCityPinVariables
  >(TOGGLE_CITY_PIN);

  const togglePinned = async (id: string, currentPinned: boolean) => {
    await toggleCityPinMutation({
      variables: { id },

      optimisticResponse: {
        togglePinnedCity: {
          __typename: 'CityOutput',
          id,
          isPinned: !currentPinned,
        },
      },

      update(cache, { data }) {
        const city = data?.togglePinnedCity;
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
