import { Field, Float, ObjectType } from '@nestjs/graphql';
import { ICitySuggestion } from '@cities/interfaces';

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
