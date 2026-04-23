import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class AddCityInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  city!: string;
}

export type CreateCityParams = {
  city: string;
  lat: number;
  lon: number;
};
