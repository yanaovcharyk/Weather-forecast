import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

@InputType()
export class PaginationInput {
  @Field(() => Int)
  @IsInt()
  @Min(1)
  limit!: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  cursor?: string;
}
