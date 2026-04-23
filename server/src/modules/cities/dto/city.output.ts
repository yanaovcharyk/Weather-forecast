import { ObjectType, Field, Int } from '@nestjs/graphql';
import { WeatherOutput } from '../../weather/dto';

@ObjectType()
export class CityOutput {
  @Field(() => Int)
  id!: number;

  @Field()
  city!: string;

  @Field(() => WeatherOutput, { nullable: true })
  weather?: WeatherOutput | null;
}

