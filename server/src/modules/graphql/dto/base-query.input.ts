import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsDefined,
  ValidateNested,
} from 'class-validator';
import { PaginationInput } from './pagination.input';

@InputType({ isAbstract: true })
export abstract class BaseQueryInput<TSorting = unknown> {
  @Field(() => PaginationInput)
  @ValidateNested()
  @Type(() => PaginationInput)
  @IsDefined()
  pagination!: PaginationInput;

  sorting?: TSorting;
}
