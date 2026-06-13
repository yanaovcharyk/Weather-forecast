import { Field, Float, ObjectType } from '@nestjs/graphql';
import { IWeatherPreviewOutput } from '../interfaces';
import { IWeatherPreviewDay } from '../interfaces/weather-preview.output.interface';

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

  @Field()
  description!: string;

  @Field(() => [WeatherPreviewDayOutput])
  next3Days!: WeatherPreviewDayOutput[];
}
