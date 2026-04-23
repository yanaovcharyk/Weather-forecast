import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../shared/types/base.entity';

@Entity('cities')
@ObjectType()
export class CityEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id!: number;

  @Column()
  @Field()
  city!: string;

  @Column('double precision')
  lat!: number;

  @Column('double precision')
  lon!: number;

  @Column('uuid')
  @Field(() => ID)
  userId!: string;
}
