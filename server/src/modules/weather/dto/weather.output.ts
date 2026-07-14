import { Field, Float, ObjectType } from '@nestjs/graphql';
import { IWeatherPreviewDay, IWeatherPreviewOutput } from '@weather/interfaces';
import { WeatherCondition } from '@weather/enums';

@ObjectType()
export class WeatherPreviewDayOutput implements IWeatherPreviewDay {
  @Field(() => Float)
  min!: number;

  @Field(() => Float)
  max!: number;

  @Field()
  description!: string;
}

@ObjectType()
export class WeatherOutput implements IWeatherPreviewOutput {
  @Field(() => Float)
  temperature!: number;

  @Field(() => Float)
  min!: number;

  @Field(() => Float)
  max!: number;

  @Field()
  description!: string;

  @Field(() => WeatherCondition)
  condition!: WeatherCondition;

  @Field(() => [WeatherPreviewDayOutput])
  next3Days!: WeatherPreviewDayOutput[];
}
