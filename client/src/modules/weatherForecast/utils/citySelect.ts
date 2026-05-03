export const getCityKey = (city: { lat: number; lon: number }) =>
  `${city.lat}-${city.lon}`;

export const findCityByKey = (
  cities: { lat: number; lon: number; name: string }[],
  key: string,
) => cities.find((city) => `${city.lat}-${city.lon}` === key);
