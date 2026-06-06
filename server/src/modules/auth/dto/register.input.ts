import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';
import { IAuthInput } from '@auth/interfaces';

@InputType()
export class RegisterInput implements IAuthInput {
  @Field()
  @IsEmail({}, { message: 'Email must be valid' })
  email!: string;

  @Field()
  @MinLength(6, { message: 'Password must contain at least 6 characters' })
  password!: string;
}
