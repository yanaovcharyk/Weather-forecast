import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { ICitySearchInput } from '@weather/interfaces';

@InputType()
export class CitySearchInput implements ICitySearchInput {
  @Field()
  @IsString()
  query!: string;
}
