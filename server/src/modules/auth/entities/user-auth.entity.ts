import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { UserEntity } from '@users/entities';
import { BaseEntity } from '@shared/entities';
import { IUserAuthOutput } from '../interfaces';

@Entity('user_auth')
export class UserAuthEntity extends BaseEntity implements IUserAuthOutput {
  @Column({ type: 'uuid', unique: true })
  userId!: string;

  @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @Column()
  passwordHash!: string;

  @Column()
  salt!: string;

  @Column({ default: 0 })
  refreshTokenVersion!: number;
}
