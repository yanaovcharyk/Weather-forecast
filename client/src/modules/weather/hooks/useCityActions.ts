import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { handleResult } from '@/common/utils';
import { useAddCity } from './useAddCity';
import { useRemoveCity } from './useRemoveCity';
import { useRemoveAllCities } from './useRemoveAllCities';
import { useTogglePinned } from './useTogglePinned';
import type { City, SelectedCity } from '@/weather/types';
import { useSavedCityLookup } from './useSavedCityLookup';
import { useToast } from '@/common/hooks/useToast';

export const useCityActions = () => {
  const toast = useToast();
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

  const { getSavedCity } = useSavedCityLookup();

  const clearExistingCitySelection = useCallback(() => {
    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.delete('existingId');
    setSearchParams(updatedParams);
    setCurrentlySelectedCity(null);
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (!selectedExistingCityId) {
      return;
    }

    if (currentlySelectedCity?.id === selectedExistingCityId) {
      return;
    }

    let isActive = true;

    const loadExistingCity = async () => {
      try {
        const city = await getSavedCity({
          id: selectedExistingCityId,
          includeWeather: true,
        });

        if (!isActive) {
          return;
        }

        if (city) {
          setCurrentlySelectedCity(city);
          return;
        }

        clearExistingCitySelection();
      } catch {
        if (isActive) {
          clearExistingCitySelection();
        }
      }
    };

    void loadExistingCity();

    return () => {
      isActive = false;
    };
  }, [
    selectedExistingCityId,
    currentlySelectedCity?.id,
    getSavedCity,
    clearExistingCitySelection,
  ]);

  const selectedCityFromUrl = selectedExistingCityId
    ? currentlySelectedCity
    : null;

  const handleAddCity = useCallback(
    async (city: SelectedCity) => {
      if (isAddingCity) {
        return;
      }

      setIsAddingCity(true);

      try {
        const existingCity = await getSavedCity({
          cityName: city.cityName,
          includeWeather: true,
        });

        if (existingCity) {
          const updatedParams = new URLSearchParams(searchParams);
          updatedParams.set('existingId', String(existingCity.id));
          setSearchParams(updatedParams);
          setCurrentlySelectedCity(existingCity);
          toast.info(`City ${city.cityName} already exists`);

          return;
        }

        await addCity(city);

        toast.success(`City ${city.cityName} added successfully`);
      } catch {
        toast.error('Failed to add city');
      } finally {
        setIsAddingCity(false);
      }
    },
    [isAddingCity, addCity, toast, getSavedCity, setSearchParams, searchParams],
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
            notifyError: toast.error,
            notifySuccess: toast.success,
          },
        );
      } finally {
        setCurrentlyRemovingCityId(null);
      }
    },
    [removeCity, selectedExistingCityId, searchParams, setSearchParams, toast],
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
        notifyError: toast.error,
        notifySuccess: toast.success,
      },
    );
  }, [removeAllCities, toast]);

  return {
    handleAddCity,
    handleRemoveCity,
    handleTogglePinned,
    handleDeleteAllCities,
    clearExistingCitySelection,
    isAddingCity,
    currentlyRemovingCityId,
    currentlySelectedCity: selectedCityFromUrl,
  };
};
