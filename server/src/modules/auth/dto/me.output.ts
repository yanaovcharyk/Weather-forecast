import { ObjectType, Field } from '@nestjs/graphql';
import { IMeOutput } from '../interfaces/me.output.interface';

@ObjectType()
export class MeOutput implements IMeOutput {
  @Field()
  userId!: string;
}
