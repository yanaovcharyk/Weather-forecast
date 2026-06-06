import { ObjectType, Field, ID } from '@nestjs/graphql';
import { IUserOutput } from '@users/interfaces';

@ObjectType()
export class UserOutput implements IUserOutput {
  @Field(() => ID)
  id!: string;

  @Field()
  email!: string;
}
