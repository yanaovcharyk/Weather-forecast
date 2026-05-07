import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { SortOrder } from '../../sorting/types';

registerEnumType(SortOrder, {
  name: 'SortOrder',
});

@InputType()
export class CitiesSortingInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  sortBy?: string;

  @Field(() => SortOrder, { nullable: true })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;
}
