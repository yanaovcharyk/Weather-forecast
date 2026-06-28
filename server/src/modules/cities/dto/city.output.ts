import { ObjectType, Field, Float, ID } from '@nestjs/graphql';
import { WeatherOutput } from '@weather/dto';
import { ICityOutput } from '@cities/interfaces';

@ObjectType()
export class CityOutput implements ICityOutput {
  @Field(() => ID)
  id!: string;

  @Field()
  cityName!: string;

  @Field(() => Float)
  lat!: number;

  @Field(() => Float)
  lon!: number;

  @Field()
  isPinned!: boolean;

  @Field(() => WeatherOutput, { nullable: true })
  weather?: WeatherOutput | null;
}
