import { Field, InputType, Float } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { IGetWeatherInput } from '@weather/interfaces';

@InputType()
export class GetWeatherInput implements IGetWeatherInput {
  @Field(() => Float)
  @IsNumber()
  lat!: number;

  @Field(() => Float)
  @IsNumber()
  lon!: number;
}
