import { ObjectType, Field, Float, ID } from '@nestjs/graphql';
import { WeatherOutput } from '../../weather/dto';

@ObjectType()
export class CityOutput {
  @Field(() => ID)
  id!: string;

  @Field()
  city!: string;

  @Field(() => Float)
  lat!: number;

  @Field(() => Float)
  lon!: number;

  @Field()
  isPinned!: boolean;

  @Field(() => WeatherOutput, { nullable: true })
  weather?: WeatherOutput | null;
}
