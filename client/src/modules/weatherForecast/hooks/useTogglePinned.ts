import { useMutation } from '@apollo/client/react';
import { CITIES_PAGINATED, TOGGLE_CITY_PIN } from '../api/weatherApi';

export const useTogglePinned = () => {
  const [toggleCityPinMutation, { loading }] = useMutation(TOGGLE_CITY_PIN, {
    refetchQueries: [CITIES_PAGINATED],
    awaitRefetchQueries: true,
  });

  const togglePinned = async (id: number) => {
    await toggleCityPinMutation({
      variables: { id },
    });
  };

  return {
    togglePinned,
    loading,
  };
};
