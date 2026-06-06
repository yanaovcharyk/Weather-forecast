import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';
import { IAddCityInput } from '@cities/interfaces';

@InputType()
export class AddCityInput implements IAddCityInput {
  @Field(() => Float)
  @IsNumber()
  lat!: number;

  @Field(() => Float)
  @IsNumber()
  lon!: number;

  @Field()
  @IsString()
  city!: string;
}
