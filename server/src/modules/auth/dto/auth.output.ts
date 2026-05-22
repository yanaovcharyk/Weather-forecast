import { ObjectType, Field } from '@nestjs/graphql';
import { IAuthOutput } from '../interfaces/auth.output.interface';

@ObjectType()
export class AuthOutput implements IAuthOutput {
  @Field()
  success!: boolean;
}
