import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { SortOrder } from '../../../shared/query/constants';
import { CitySortField } from '../city-query.config';

registerEnumType(SortOrder, {
  name: 'SortOrder',
});

@InputType()
export class CitiesSortingInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  sortBy?: CitySortField;

  @Field(() => SortOrder, { nullable: true })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;
}
