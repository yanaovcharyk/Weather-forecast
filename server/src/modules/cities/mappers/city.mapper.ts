import { CityOutput } from '../dto';
import { CityEntity } from '../entities/city.entity';

export function mapToOutput(city: CityEntity): CityOutput {
  return {
    id: city.id,
    city: city.city,
    lat: city.lat,
    lon: city.lon,
    isPinned: city.isPinned,
  };
}
