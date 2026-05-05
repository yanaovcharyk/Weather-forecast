import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { BaseEntity } from '../../../shared/types/base.entity';

@Unique(['userId', 'lat', 'lon'])
@Entity('cities')
@ObjectType()
export class CityEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id!: number;

  @Column()
  @Field()
  city!: string;

  @Column('float')
  @Field(() => Float)
  lat!: number;

  @Column('float')
  @Field(() => Float)
  lon!: number;

  @Column('uuid')
  @Field(() => ID)
  userId!: string;
}
