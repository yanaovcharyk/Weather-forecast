import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class WeatherCurrent {
  @Field(() => Float)
  temp!: number;

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
export class DailyWeather {
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
export class HourlyWeather {
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
export class WeatherMeta {
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
