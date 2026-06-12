import { groupForecastByDate } from './group-forecast-by-date.util';

describe('groupForecastByDate', () => {
  it('should group forecast items by date', () => {
    const forecastItems: any[] = [
      {
        dt_txt: '2025-01-01 00:00:00',
      },
      {
        dt_txt: '2025-01-01 03:00:00',
      },
      {
        dt_txt: '2025-01-02 00:00:00',
      },
    ];

    const groupedForecast = groupForecastByDate(forecastItems);

    expect(Object.keys(groupedForecast)).toEqual([
      '2025-01-01',
      '2025-01-02',
    ]);

    expect(groupedForecast['2025-01-01']).toHaveLength(2);
    expect(groupedForecast['2025-01-02']).toHaveLength(1);
  });

  it('should return empty object for empty array', () => {
    expect(groupForecastByDate([])).toEqual({});
  });
});
