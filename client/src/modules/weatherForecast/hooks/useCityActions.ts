import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { handleResult } from '@/common/utils';
import { useAddCity } from './useAddCity';
import { useRemoveCity } from './useRemoveCity';
import { useRemoveAllCities } from './useRemoveAllCities';
import { useTogglePinned } from './useTogglePinned';
import type { City } from '@/weatherForecast/types';
import { useCityByName } from './useCityByName';

type NotificationFunction = (message: string) => void;

interface CityActionsOptions {
  showSuccessNotification: NotificationFunction;
  showErrorNotification: NotificationFunction;
  showInfoNotification: NotificationFunction;
}

export const useCityActions = ({
  showSuccessNotification,
  showErrorNotification,
  showInfoNotification,
}: CityActionsOptions) => {
  const { addCity } = useAddCity();
  const { removeCity } = useRemoveCity();
  const { removeAllCities } = useRemoveAllCities();
  const { togglePinned } = useTogglePinned();

  const [isAddingCity, setIsAddingCity] = useState(false);
  const [currentlyRemovingCityId, setCurrentlyRemovingCityId] = useState<
    string | null
  >(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedExistingCityId = searchParams.get('existingId');

  const [currentlySelectedCity, setCurrentlySelectedCity] =
    useState<City | null>(null);

  const { getCityByName } = useCityByName();

  const handleAddCity = useCallback(
    async (lat: number, lon: number, city: string) => {
      if (isAddingCity) {
        return;
      }

      setIsAddingCity(true);

      try {
        const existingCity = await getCityByName(city);

        if (existingCity) {
          const updatedParams = new URLSearchParams(searchParams);
          updatedParams.set('existingId', String(existingCity.id));
          setSearchParams(updatedParams);
          setCurrentlySelectedCity(existingCity);
          showInfoNotification(`City ${city} already exists`);

          return;
        }

        await addCity(lat, lon, city);

        showSuccessNotification(`City ${city} added successfully`);
      } catch {
        showErrorNotification('Failed to add city');
      } finally {
        setIsAddingCity(false);
      }
    },
    [
      isAddingCity,
      addCity,
      showInfoNotification,
      showSuccessNotification,
      showErrorNotification,
      getCityByName,
      setSearchParams,
      searchParams,
    ],
  );

  const handleRemoveCity = useCallback(
    async (cityId: string, cityName: string) => {
      setCurrentlyRemovingCityId(cityId);
      try {
        await removeCity(cityId);
        if (selectedExistingCityId && selectedExistingCityId === cityId) {
          const updatedParams = new URLSearchParams(searchParams);
          updatedParams.delete('existingId');
          setSearchParams(updatedParams);
          setCurrentlySelectedCity(null);
        }
        handleResult(
          { ok: true },
          {
            successMessage: `City ${cityName} removed successfully`,
            notifyError: showErrorNotification,
            notifySuccess: showSuccessNotification,
          },
        );
      } finally {
        setCurrentlyRemovingCityId(null);
      }
    },
    [
      removeCity,
      selectedExistingCityId,
      searchParams,
      setSearchParams,
      showErrorNotification,
      showSuccessNotification,
    ],
  );

  const handleTogglePinned = useCallback(
    async (cityId: string, isCurrentPinned: boolean) => {
      await togglePinned(cityId, isCurrentPinned);
      setCurrentlySelectedCity((previousCity) =>
        previousCity && previousCity.id === cityId
          ? { ...previousCity, isPinned: !previousCity.isPinned }
          : previousCity,
      );
    },
    [togglePinned],
  );

  const handleDeleteAllCities = useCallback(async () => {
    const result = await removeAllCities();

    handleResult(
      { ok: result.ok, code: result.code },
      {
        successMessage: 'All cities removed successfully',
        notifyError: showErrorNotification,
        notifySuccess: showSuccessNotification,
      },
    );
  }, [removeAllCities, showErrorNotification, showSuccessNotification]);

  return {
    handleAddCity,
    handleRemoveCity,
    handleTogglePinned,
    handleDeleteAllCities,
    isAddingCity,
    currentlyRemovingCityId,
    currentlySelectedCity,
    setCurrentlySelectedCity,
  };
};
