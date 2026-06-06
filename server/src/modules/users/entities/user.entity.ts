import { ObjectType } from '@nestjs/graphql';
import { Entity, Column, } from 'typeorm';
import { BaseEntity } from '@shared/entities';

@Entity('users')
@ObjectType()
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  salt!: string;

  @Column({ default: 0 })
  refreshTokenVersion!: number;
}