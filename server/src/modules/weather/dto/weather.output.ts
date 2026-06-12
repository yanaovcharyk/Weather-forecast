import { Field, Float, ObjectType } from '@nestjs/graphql';
import { IWeatherPreviewOutput } from '../interfaces';

@ObjectType()
export class WeatherOutput implements IWeatherPreviewOutput {
  @Field(() => Float)
  temperature!: number;

  @Field()
  description!: string;

  @Field(() => [Float])
  next3DaysTemperature!: number[];

  @Field(() => [String])
  next3DaysDescription!: string[];
}
