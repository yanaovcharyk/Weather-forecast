import { ObjectType } from '@nestjs/graphql';
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@shared/entities';
import { IUserEntity } from '../interfaces';

@Entity('users')
@ObjectType()
export class UserEntity extends BaseEntity implements IUserEntity {
  @Column({ unique: true })
  email!: string;
}
