import { forecastFixture } from './forecast.fixture';

export const forecastWithoutTimezoneFixture = {
  ...forecastFixture,
  city: {
    ...forecastFixture.city,
    timezone: undefined,
  },
};
