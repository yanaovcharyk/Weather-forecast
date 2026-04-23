import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { IAddUserInput } from '../interfaces';

@InputType()
export class AddUserInput implements IAddUserInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsString()
  @MinLength(6)
  password!: string;

  @Field()
  @IsString()
  salt!: string;
}
