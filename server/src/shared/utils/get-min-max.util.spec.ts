import { getMinMax } from './get-min-max.util';

describe('getMinMax', () => {
  it('should return min and max values', () => {
    const items = [{ temp: 15 }, { temp: 8 }, { temp: 22 }, { temp: 10 }];

    const result = getMinMax(items, (item) => item.temp);

    expect(result).toEqual({
      min: 8,
      max: 22,
    });
  });

  it('should return same value as min and max for single item', () => {
    const items = [{ temp: 18 }];

    const result = getMinMax(items, (item) => item.temp);

    expect(result).toEqual({
      min: 18,
      max: 18,
    });
  });

  it('should return zeroes for empty array', () => {
    const result = getMinMax([], (item: { temp: number }) => item.temp);

    expect(result).toEqual({
      min: 0,
      max: 0,
    });
  });

  it('should work with negative values', () => {
    const items = [{ temp: -15 }, { temp: -5 }, { temp: -20 }];

    const result = getMinMax(items, (item) => item.temp);

    expect(result).toEqual({
      min: -20,
      max: -5,
    });
  });
});
