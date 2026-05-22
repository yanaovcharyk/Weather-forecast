import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { PaginationInput } from './pagination.input';
import { FilterInput } from './filter.input';

@InputType({ isAbstract: true })
export abstract class BaseQueryInput<TSorting = unknown> {
  @Field(() => PaginationInput)
  @ValidateNested()
  @Type(() => PaginationInput)
  @IsDefined()
  pagination!: PaginationInput;

  @Field(() => [FilterInput], { nullable: true })
  @ValidateNested({ each: true })
  @Type(() => FilterInput)
  @IsOptional()
  filters?: FilterInput[];

  sorting?: TSorting;
}
