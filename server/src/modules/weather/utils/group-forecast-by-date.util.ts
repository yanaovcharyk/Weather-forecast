import { IOpenWeatherForecastItem } from '@weather/interfaces';

export const groupForecastByDate = (
  forecastItems: IOpenWeatherForecastItem[],
): Record<string, IOpenWeatherForecastItem[]> =>
  forecastItems.reduce(
    (
      groupedForecastItems: Record<string, IOpenWeatherForecastItem[]>,
      forecastItem: IOpenWeatherForecastItem,
    ) => {
      const forecastDate = forecastItem.dt_txt.split(' ')[0];

      if (!groupedForecastItems[forecastDate]) {
        groupedForecastItems[forecastDate] = [];
      }

      groupedForecastItems[forecastDate].push(forecastItem);

      return groupedForecastItems;
    },
    {},
  );
  