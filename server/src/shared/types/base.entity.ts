import { ObjectType, Field, ID } from '@nestjs/graphql';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
export abstract class BaseEntity {
  @CreateDateColumn({ type: 'timestamp with time zone' })
  @Field()
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @Field()
  updatedAt!: Date;
}
