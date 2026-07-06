import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { ICreateUserInput } from '@users/interfaces';

@InputType()
export class CreateUserInput implements ICreateUserInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsString()
  @MinLength(6)
  password!: string;
}
