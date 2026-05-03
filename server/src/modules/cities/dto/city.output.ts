import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { WeatherOutput } from '../../weather/dto';

@ObjectType()
export class CityOutput {
  @Field(() => Int)
  id!: number;

  @Field()
  city!: string;

  @Field(() => Float)
  lat!: number;

  @Field(() => Float)
  lon!: number;

  @Field(() => WeatherOutput, { nullable: true })
  weather?: WeatherOutput | null;
}
