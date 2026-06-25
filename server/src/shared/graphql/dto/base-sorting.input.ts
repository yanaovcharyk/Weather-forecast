import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { SortOrder } from '@shared/constants';

registerEnumType(SortOrder, {
  name: 'SortOrder',
});

@InputType({ isAbstract: true })
export abstract class BaseSortingInput {
  @Field(() => SortOrder, { nullable: true })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;
}
