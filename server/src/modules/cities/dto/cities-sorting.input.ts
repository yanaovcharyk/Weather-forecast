import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { CitySortField } from '@cities/city-query.config';
import { BaseSortingInput } from '@graphql/dto';

registerEnumType(CitySortField, {
  name: 'CitySortField',
});

@InputType()
export class CitiesSortingInput extends BaseSortingInput {
  @Field(() => CitySortField, { nullable: true })
  @IsOptional()
  @IsEnum(CitySortField)
  sortBy?: CitySortField;
}
