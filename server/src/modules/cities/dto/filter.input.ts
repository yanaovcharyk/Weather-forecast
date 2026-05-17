import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { FilterOperator } from '@shared/query/constants';

registerEnumType(FilterOperator, {
  name: 'FilterOperator',
});

@InputType()
export class FilterInput {
  @Field()
  field!: string;

  @Field(() => FilterOperator)
  operator!: FilterOperator;

  @Field()
  value!: string;
}
