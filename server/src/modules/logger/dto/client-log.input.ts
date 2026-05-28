import { Field, InputType, Int } from '@nestjs/graphql';

import {
  IsBoolean,
  IsIn,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

@InputType()
export class ClientLogInput {
  @Field()
  @IsISO8601()
  timestamp!: string;

  @Field()
  @IsIn(['info', 'warn', 'error', 'debug'])
  level!: string;

  @Field()
  @IsString()
  @MaxLength(5000)
  message!: string;

  @Field({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  requestId?: string;

  @Field({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  userId?: string;

  @Field({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  sessionId?: string;

  @Field({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  route?: string;

  @Field({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10000)
  metadata?: string;

  @Field({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  operationName?: string;

  @Field({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  variables?: string;

  @Field({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  path?: string;

  @Field({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @Field({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  module?: string;

  @Field(() => Int, {
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  executionTimeMs?: number;

  @Field(() => Boolean, {
    nullable: true,
  })
  @IsOptional()
  @IsBoolean()
  hasErrors?: boolean;
}
