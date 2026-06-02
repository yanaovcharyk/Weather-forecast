import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class MeOutput {
  @Field()
  userId!: string;
}
