import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
import { Entity, Column, Unique } from 'typeorm';
import { BaseEntity } from '@shared/entities';

@Unique(['userId', 'lat', 'lon'])
@Entity('cities')
@ObjectType()
export class CityEntity extends BaseEntity {
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

  @Column({ default: false })
  @Field()
  isPinned!: boolean;
}
