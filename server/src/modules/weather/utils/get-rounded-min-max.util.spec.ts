import { getRoundedMinMax } from './get-rounded-min-max.util';

describe('getRoundedMinMax', () => {
  it('should return rounded min and max values', () => {
    const items = [
      { temp: 10.4 },
      { temp: 15.8 },
      { temp: 5.2 },
    ];

    const result = getRoundedMinMax(
      items,
      (item) => item.temp,
    );

    expect(result).toEqual({
      min: 5,
      max: 16,
    });
  });

  it('should return zeroes for empty array', () => {
    const result = getRoundedMinMax(
      [],
      (item: { temp: number }) => item.temp,
    );

    expect(result).toEqual({
      min: 0,
      max: 0,
    });
  });

  it('should round negative values correctly', () => {
    const items = [
      { temp: -10.7 },
      { temp: -3.2 },
      { temp: -7.5 },
    ];

    const result = getRoundedMinMax(
      items,
      (item) => item.temp,
    );

    expect(result).toEqual({
      min: -11,
      max: -3,
    });
  });
});
