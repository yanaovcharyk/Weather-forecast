import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { IAuthInput } from '@auth/interfaces';

@InputType()
export class LoginInput implements IAuthInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsNotEmpty()
  password!: string;
}
