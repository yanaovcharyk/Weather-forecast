import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { IGetWeatherInput } from '../interfaces';

@InputType()
export class GetWeatherInput implements IGetWeatherInput {
  @Field()
  @IsString()
  lat!: number;
  
  @Field()
  @IsString()
  lon!: number;
}
