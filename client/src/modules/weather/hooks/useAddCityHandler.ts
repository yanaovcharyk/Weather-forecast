import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@/common/hooks/useToast';
import { useAddCity } from './useAddCity';
import { useSavedCityLookup } from './useSavedCityLookup';
import type { SelectedCity } from '@/weather/types';

export const useAddCityHandler = () => {
  const toast = useToast();
  const { addCity } = useAddCity();
  const { getSavedCity } = useSavedCityLookup();

  const [searchParams, setSearchParams] = useSearchParams();
  const [isAddingCity, setIsAddingCity] = useState(false);

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

          toast.info(`City ${city.cityName} already exists`);
          return;
        }

        await addCity(city);

        if (searchParams.has('existingId')) {
          const updatedParams = new URLSearchParams(searchParams);
          updatedParams.delete('existingId');
          setSearchParams(updatedParams);
        }

        toast.success(`City ${city.cityName} added successfully`);
      } catch {
        toast.error('Failed to add city');
      } finally {
        setIsAddingCity(false);
      }
    },
    [isAddingCity, addCity, getSavedCity, searchParams, setSearchParams, toast],
  );

  return {
    handleAddCity,
    isAddingCity,
  };
};
