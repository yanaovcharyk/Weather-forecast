import { Field, InputType } from '@nestjs/graphql';
import { CitiesSortingInput } from './cities-sorting.input';
import { FilterInput } from './filter.input';
import { PaginationInput } from '../../../shared/dto/pagination.input';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsOptional,
  ValidateNested,
} from 'class-validator';

@InputType()
export class CitiesQueryInput {
  @Field(() => PaginationInput)
  @ValidateNested()
  @Type(() => PaginationInput)
  @IsDefined()
  pagination!: PaginationInput;

  @Field(() => CitiesSortingInput, { nullable: true })
  @ValidateNested()
  @Type(() => CitiesSortingInput)
  @IsOptional()
  sorting?: CitiesSortingInput;

  @Field(() => [FilterInput], { nullable: true })
  @ValidateNested({ each: true })
  @Type(() => FilterInput)
  @IsOptional()
  filters?: FilterInput[];

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  showPinnedOnly?: boolean;
}
