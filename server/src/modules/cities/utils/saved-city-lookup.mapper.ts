import { BadRequestException } from '@nestjs/common';
import { SavedCityLookupParams } from '@cities/types';

export type SavedCityLookupArgs = {
  id?: string;
  cityName?: string;
};

type LookupMapper = (userId: string, value: string) => SavedCityLookupParams;

const LOOKUP_MAPPERS: Record<keyof SavedCityLookupArgs, LookupMapper> = {
  id: (userId, id) => ({
    userId,
    id,
  }),

  cityName: (userId, cityName) => ({
    userId,
    cityName,
  }),
};

export function toSavedCityLookupParams(
  userId: string,
  args: SavedCityLookupArgs,
): SavedCityLookupParams {
  for (const [key, mapper] of Object.entries(LOOKUP_MAPPERS) as [
    keyof SavedCityLookupArgs,
    LookupMapper,
  ][]) {
    const value = args[key]?.trim();

    if (value) {
      return mapper(userId, value);
    }
  }

  throw new BadRequestException('City id or name is required');
}
