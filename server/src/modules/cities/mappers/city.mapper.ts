import { CityOutput } from '../dto';
import { CityEntity } from '../entities/city.entity';
import { ICityEntity } from '../interfaces/city.entity.interface';
import { ICityOutput } from '../interfaces/city.output.interface';

export function mapToOutput(city: ICityEntity): ICityOutput {
  return {
    id: city.id,
    city: city.city,
    lat: city.lat,
    lon: city.lon,
    isPinned: city.isPinned,
  };
}
