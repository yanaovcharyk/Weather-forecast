import { IMinMax } from '@shared/utils/get-min-max.util';
import { getRoundedMinMax } from './get-rounded-min-max.util';

export function getTemperatureRange<T>(
  items: T[],
  minSelector: (item: T) => number,
  maxSelector: (item: T) => number,
): IMinMax {
  return {
    min: getRoundedMinMax(items, minSelector).min,
    max: getRoundedMinMax(items, maxSelector).max,
  };
}
