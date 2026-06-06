import { ObjectType, Field } from '@nestjs/graphql';
import { IAuthOutput } from '@auth/interfaces';

@ObjectType()
export class AuthOutput implements IAuthOutput {
  @Field()
  success!: boolean;
}
