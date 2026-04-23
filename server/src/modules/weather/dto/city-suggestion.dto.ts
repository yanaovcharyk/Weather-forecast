import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CitySuggestion {
  @Field()
  name!: string;

  @Field()
  country!: string;

  @Field()
  lat!: number;

  @Field()
  lon!: number;
}
