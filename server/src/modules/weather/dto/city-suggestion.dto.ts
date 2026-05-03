import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class CitySuggestion {
  @Field()
  name!: string;

  @Field()
  country!: string;

  @Field(() => Float)
  lat!: number;

  @Field(() => Float)
  lon!: number;
}
