import { calculateAverage } from '@shared/utils/calculate-average.util';

describe('calculateAverage', () => {
  it('should return average value', () => {
    expect(calculateAverage([10, 20, 30])).toBe(20);
  });

  it('should return same value for single item array', () => {
    expect(calculateAverage([42])).toBe(42);
  });

  it('should return 0 for empty array', () => {
    expect(calculateAverage([])).toBe(0);
  });

  it('should handle decimal numbers', () => {
    expect(calculateAverage([1.5, 2.5])).toBe(2);
  });
});
