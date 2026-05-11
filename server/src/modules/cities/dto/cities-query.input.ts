import { Field, InputType } from '@nestjs/graphql';
import { CitiesSortingInput } from './cities-sorting.input';
import { FilterInput } from './filter.input';
import { CitiesPaginationInput } from './cities-pagination.input';
import { Type } from 'class-transformer';
import { IsBoolean, IsDefined, IsOptional, ValidateNested } from 'class-validator';

@InputType()
export class CitiesQueryInput {
  @Field(() => CitiesPaginationInput)
  @ValidateNested()
  @Type(() => CitiesPaginationInput)
  @IsDefined()
  pagination!: CitiesPaginationInput;

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

