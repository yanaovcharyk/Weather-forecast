import { Field, InputType } from '@nestjs/graphql';
import { CitiesSortingInput } from './cities-sorting.input';
import { FilterInput } from './filter.input';
import { CitiesPaginationInput } from './cities-pagination.input';
import { Type } from 'class-transformer';

@InputType()
export class CitiesQueryInput {
  @Field(() => CitiesPaginationInput)
  @Type(() => CitiesPaginationInput)
  pagination!: CitiesPaginationInput;

  @Field(() => CitiesSortingInput, {
    nullable: true,
  })
  @Type(() => CitiesSortingInput)
  sorting?: CitiesSortingInput;

  @Field(() => [FilterInput], {
    nullable: true,
  })
  @Type(() => FilterInput)
  filters?: FilterInput[];
}
