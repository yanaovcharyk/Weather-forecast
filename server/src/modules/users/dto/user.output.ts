import { ObjectType, Field, ID } from '@nestjs/graphql';
import { IUserOutput } from '../interfaces/user-output.interface';

@ObjectType()
export class UserOutput implements IUserOutput {
  @Field(() => ID)
  id!: string;

  @Field()
  email!: string;
}
