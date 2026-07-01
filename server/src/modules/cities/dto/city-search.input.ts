import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { ICitySearchInput } from '@cities/interfaces';

@InputType()
export class CitySearchInput implements ICitySearchInput {
  @Field()
  @IsString()
  query!: string;
}
