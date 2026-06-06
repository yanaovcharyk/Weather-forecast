import { ObjectType, Field } from '@nestjs/graphql';
import { IMeOutput } from '@auth/interfaces';

@ObjectType()
export class MeOutput implements IMeOutput {
  @Field()
  userId!: string;
}
