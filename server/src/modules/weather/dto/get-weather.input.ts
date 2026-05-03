import { Field, InputType, Float } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class GetWeatherInput {
  @Field(() => Float)
  @IsNumber()
  lat!: number;

  @Field(() => Float)
  @IsNumber()
  lon!: number;
}
