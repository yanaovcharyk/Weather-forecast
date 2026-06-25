import type { Type } from '@nestjs/common';
import { ID, type ReturnTypeFunc } from '@nestjs/graphql';

export const graphqlIdType: ReturnTypeFunc = () => ID;

export const graphqlType =
  <T>(type: Type<T> | BooleanConstructor): ReturnTypeFunc =>
  () =>
    type;

export const graphqlListType =
  <T>(itemType: Type<T>): ReturnTypeFunc =>
  () => [itemType];
