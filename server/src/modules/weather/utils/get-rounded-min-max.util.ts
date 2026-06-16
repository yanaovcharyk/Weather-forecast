import { getMinMax, IMinMax } from '@shared/utils/get-min-max.util';

export function getRoundedMinMax<T>(
  items: T[],
  selector: (item: T) => number,
): IMinMax {
  const range = getMinMax(items, selector);

  return {
    min: Math.round(range.min),
    max: Math.round(range.max),
  };
}
