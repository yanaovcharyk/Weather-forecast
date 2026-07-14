import { registerEnumType } from '@nestjs/graphql';

export enum WeatherCondition {
  CLEAR = 'CLEAR',
  FEW_CLOUDS = 'FEW_CLOUDS',
  SCATTERED_CLOUDS = 'SCATTERED_CLOUDS',
  BROKEN_CLOUDS = 'BROKEN_CLOUDS',
  OVERCAST = 'OVERCAST',
  DRIZZLE = 'DRIZZLE',
  RAIN = 'RAIN',
  THUNDERSTORM = 'THUNDERSTORM',
  SNOW = 'SNOW',
  SLEET = 'SLEET',
  MIST = 'MIST',
  DUST = 'DUST',
  TORNADO = 'TORNADO',
  WIND = 'WIND',
  UNKNOWN = 'UNKNOWN',
}

registerEnumType(WeatherCondition, {
  name: 'WeatherCondition',
});
