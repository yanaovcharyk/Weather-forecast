import { Field, Float, ObjectType } from '@nestjs/graphql';
import { IWeatherOutput } from '../interfaces';

@ObjectType()
export class WeatherOutput implements IWeatherOutput {
  @Field()
  city!: string;

  @Field(() => Float)
  temperature!: number;

  @Field()
  description!: string;

  @Field(() => [Float])
  next3DaysTemperature!: number[];

  @Field(() => [String])
  next3DaysDescription!: string[];
}
