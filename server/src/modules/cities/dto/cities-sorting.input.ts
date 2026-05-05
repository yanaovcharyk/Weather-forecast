import { Field, InputType } from "@nestjs/graphql";
import { IsOptional, IsString } from'class-validator'

export const SortableCityField = {
  CITY: 'city',
  CREATED_AT: 'createdAt',
} as const;

export type SortableCityField =
  (typeof SortableCityField)[keyof typeof SortableCityField];

export const SortOrder = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const;

export type SortOrder =
  (typeof SortOrder)[keyof typeof SortOrder];

@InputType()
export class CitiesSortingInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  sortBy?: SortableCityField;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  sortOrder?: SortOrder;
}
