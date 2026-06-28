import { Entity, Column, Unique } from 'typeorm';
import { BaseEntity } from '@shared/entities';

@Unique(['userId', 'lat', 'lon'])
@Entity('cities')
export class CityEntity extends BaseEntity {
  @Column()
  cityName!: string;

  @Column('float')
  lat!: number;

  @Column('float')
  lon!: number;

  @Column('uuid')
  userId!: string;

  @Column({ default: false })
  isPinned!: boolean;
}
