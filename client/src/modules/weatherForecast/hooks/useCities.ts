import { useQuery } from '@apollo/client/react/compiled';
import { CITIES_QUERY } from '../api';
import type { CitiesQuery } from '@/shared/types';

export const useCities = () => {
  return useQuery<CitiesQuery>(CITIES_QUERY);
};
