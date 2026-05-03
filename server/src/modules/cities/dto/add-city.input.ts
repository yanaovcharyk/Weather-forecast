import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@InputType()
export class AddCityInput {
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
