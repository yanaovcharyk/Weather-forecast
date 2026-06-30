import { calculateAverageBy } from './calculate-average-by.util';

describe('calculateAverageBy', () => {
  it('should calculate average value using selector', () => {
    const items = [
      { value: 10 },
      { value: 20 },
      { value: 30 },
    ];

    const result = calculateAverageBy(
      items,
      (item) => item.value,
    );

    expect(result).toBe(20);
  });

  it('should return 0 for empty array', () => {
    const result = calculateAverageBy(
      [],
      (item: { value: number }) => item.value,
    );

    expect(result).toBe(0);
  });

  it('should return rounded average for negative numbers', () => {
    const items = [
      { value: -10 },
      { value: 20 },
      { value: -5 },
    ];

    const result = calculateAverageBy(
      items,
      (item) => item.value,
    );

    expect(result).toBe(2);
  });
});
