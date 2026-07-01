import { InputType, Field, Float } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';
import { IUpdateCityInput } from '@cities/interfaces';

@InputType()
export class UpdateCityInput implements IUpdateCityInput {
  @Field(() => Float, { nullable: true })
  @ValidateIf((_, value) => value !== undefined)
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat?: number;

  @Field(() => Float, { nullable: true })
  @ValidateIf((_, value) => value !== undefined)
  @IsNumber()
  @Min(-180)
  @Max(180)
  lon?: number;

  @Field({ nullable: true })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  cityName?: string;

  @Field({ nullable: true })
  @ValidateIf((_, value) => value !== undefined)
  @IsBoolean()
  isPinned?: boolean;
}
