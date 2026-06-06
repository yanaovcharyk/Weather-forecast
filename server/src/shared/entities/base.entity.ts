import { ObjectType, Field, ID } from '@nestjs/graphql';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id!: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @Field()
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @Field()
  updatedAt!: Date;
}
