import { ObjectType, Field, Float, ID } from '@nestjs/graphql';
import { WeatherOutput } from '../../weather/dto';
import { ICityOutput } from '../interfaces/city.output.interface';

@ObjectType()
export class CityOutput implements ICityOutput {
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
