import { calculateAverage } from '@shared/utils/calculate-average.util';

export function calculateAverageBy<T>(
  items: T[],
  selector: (item: T) => number,
): number {
  return calculateAverage(items.map(selector));
}
