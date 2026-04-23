import { ArgsType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ArgsType()
export class CitySearchInput {
  @Field()
  @IsString()
  query!: string;
}
