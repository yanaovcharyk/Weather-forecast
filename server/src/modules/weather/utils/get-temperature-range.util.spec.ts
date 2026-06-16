import { getTemperatureRange } from './get-temperature-range.util';

describe('getTemperatureRange', () => {
  it('should return rounded temperature range', () => {
    const items = [
      {
        minTemp: 5.3,
        maxTemp: 12.8,
      },
      {
        minTemp: 2.2,
        maxTemp: 15.4,
      },
      {
        minTemp: 7.1,
        maxTemp: 10.6,
      },
    ];

    const result = getTemperatureRange(
      items,
      (item) => item.minTemp,
      (item) => item.maxTemp,
    );

    expect(result).toEqual({
      min: 2,
      max: 15,
    });
  });

  it('should return zeroes for empty array', () => {
    const result = getTemperatureRange<{
      minTemp: number;
      maxTemp: number;
    }>(
      [],
      (item) => item.minTemp,
      (item) => item.maxTemp,
    );

    expect(result).toEqual({
      min: 0,
      max: 0,
    });
  });

  it('should work with negative temperatures', () => {
    const items = [
      {
        minTemp: -12.8,
        maxTemp: -1.2,
      },
      {
        minTemp: -8.3,
        maxTemp: 2.6,
      },
    ];

    const result = getTemperatureRange(
      items,
      (item) => item.minTemp,
      (item) => item.maxTemp,
    );

    expect(result).toEqual({
      min: -13,
      max: 3,
    });
  });
});
