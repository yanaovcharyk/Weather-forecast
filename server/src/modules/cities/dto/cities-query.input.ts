import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { CitiesSortingInput } from './cities-sorting.input';
import { BaseQueryInput } from '@shared/graphql/dto';

@InputType()
export class CitiesQueryInput extends BaseQueryInput<CitiesSortingInput> {
  @Field(() => CitiesSortingInput, { nullable: true })
  @ValidateNested()
  @Type(() => CitiesSortingInput)
  @IsOptional()
  declare sorting?: CitiesSortingInput;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  showPinnedOnly?: boolean;
}
