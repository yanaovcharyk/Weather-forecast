import { Field, Float, ObjectType } from '@nestjs/graphql';
import {
  IDailyWeather,
  IHourlyWeather,
  IWeatherCurrent,
  IWeatherDetails,
  IWeatherMeta,
} from '@weather/interfaces';

@ObjectType()
export class WeatherCurrent implements IWeatherCurrent {
  @Field(() => Float)
  temp!: number;

  @Field(() => Float)
  min!: number;

  @Field(() => Float)
  max!: number;

  @Field(() => Float)
  feelsLike!: number;

  @Field(() => Float)
  humidity!: number;

  @Field(() => Float)
  windSpeed!: number;

  @Field(() => Float)
  pressure!: number;

  @Field()
  description!: string;

  @Field()
  icon!: string;

  @Field()
  sunrise!: string;

  @Field()
  sunset!: string;
}

@ObjectType()
export class DailyWeather implements IDailyWeather {
  @Field()
  date!: string;

  @Field(() => Float)
  min!: number;

  @Field(() => Float)
  max!: number;

  @Field()
  description!: string;

  @Field()
  icon!: string;

  @Field(() => Float)
  humidity!: number;

  @Field(() => Float)
  pressure!: number;

  @Field(() => Float)
  clouds!: number;

  @Field(() => Float)
  windSpeed!: number;

  @Field(() => Float)
  pop!: number;

  @Field(() => Float)
  feelsLike!: number;
}

@ObjectType()
export class HourlyWeather implements IHourlyWeather {
  @Field()
  time!: string;

  @Field(() => Float)
  temp!: number;

  @Field(() => Float)
  feelsLike!: number;

  @Field()
  icon!: string;
}

@ObjectType()
export class WeatherMeta implements IWeatherMeta {
  @Field()
  timezone!: string;
}

@ObjectType()
export class WeatherDetailsOutput {

  @Field(() => WeatherCurrent)
  current!: WeatherCurrent;

  @Field(() => [HourlyWeather])
  hourly!: HourlyWeather[];

  @Field(() => [DailyWeather])
  daily!: DailyWeather[];

  @Field(() => WeatherMeta, { nullable: true })
  meta?: WeatherMeta;
}
