import { ICityEntity, ICityOutput } from '@cities/interfaces';

export function mapToOutput(city: ICityEntity): ICityOutput {
  return {
    id: city.id,
    city: city.city,
    lat: city.lat,
    lon: city.lon,
    isPinned: city.isPinned,
  };
}
