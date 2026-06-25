import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { CitySortField } from '@cities/city-query.config';
import { BaseSortingInput } from '@shared/graphql/dto';

registerEnumType(CitySortField, {
  name: 'CitySortField',
});

@InputType()
export class CitiesSortingInput extends BaseSortingInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  sortBy?: CitySortField;
}
