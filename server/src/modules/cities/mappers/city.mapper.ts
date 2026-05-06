import { CityEntity } from '../entities/city.entity';
import { ICityOutput } from '../interfaces/city.interface';

export function mapToOutput(city: CityEntity): ICityOutput {
  return {
    id: city.id,
    city: city.city,
    lat: city.lat,
    lon: city.lon,
  };
}
