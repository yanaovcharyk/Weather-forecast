import { ObjectType, Field, Float } from '@nestjs/graphql';
import { ICitySuggestion } from '../interfaces/city-suggestion.interface';

@ObjectType()
export class CitySuggestion implements ICitySuggestion {
  @Field()
  name!: string;

  @Field()
  country!: string;

  @Field(() => Float)
  lat!: number;

  @Field(() => Float)
  lon!: number;
}
