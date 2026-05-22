import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { CitySortField } from '../city-query.config';
import { BaseSortingInput } from '../../../shared/graphql/dto/base-sorting.input';

registerEnumType(CitySortField, {
  name: 'CitySortField',
});

@InputType()
export class CitiesSortingInput extends BaseSortingInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  sortBy?: CitySortField;
}
