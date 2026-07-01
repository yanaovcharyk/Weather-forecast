import { Field, ObjectType } from '@nestjs/graphql';
import { IMeOutput } from '@users/interfaces';

@ObjectType()
export class MeOutput implements IMeOutput {
  @Field()
  userId!: string;
}
