import { InputType, Field, Float } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { IAddCityInput } from '@cities/interfaces';

@InputType()
export class AddCityInput implements IAddCityInput {
  @Field(() => Float)
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat!: number;

  @Field(() => Float)
  @IsNumber()
  @Min(-180)
  @Max(180)
  lon!: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  cityName!: string;
}
