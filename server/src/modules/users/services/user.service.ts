import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Pbkdf2PasswordHasher } from '../../auth/services/password-hasher.service';
import { RegisterInput } from '../../auth/dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly passwordHasher: Pbkdf2PasswordHasher,
  ) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async register(input: RegisterInput): Promise<UserEntity> {
    const { hash, salt } = await this.passwordHasher.hash(input.password);

    const user = this.userRepository.create({
      email: input.email,
      password: hash,
      salt,
    });

    return this.userRepository.save(user);
  }

  async createUser(data: Partial<UserEntity>): Promise<UserEntity> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async updateRefreshTokenVersion(
    userId: string,
    version: number,
  ): Promise<void> {
    await this.userRepository.update(userId, {
      refreshTokenVersion: version,
    });
  }
}
