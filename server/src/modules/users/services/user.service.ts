import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Pbkdf2PasswordHasher } from '@auth/services/password-hasher.service';
import { RegisterInput } from '@auth/dto';
import { AppLoggerService } from '@logger/services';
import { UpdateRefreshTokenVersionParams } from '../types';
import { IUserEntity } from '../interfaces';
import { LogResolver } from '../../../shared/logging';
@Injectable()
export class UserService {
  private readonly logger;

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly passwordHasher: Pbkdf2PasswordHasher,
    loggerService: AppLoggerService,
  ) {
    this.logger = loggerService.child(UserService.name);
  }

  @LogResolver()
  async findByEmail(email: string): Promise<IUserEntity | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  @LogResolver()
  async findById(id: string): Promise<IUserEntity | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  @LogResolver()
  async register(input: RegisterInput): Promise<IUserEntity> {
    const { hash, salt } = await this.passwordHasher.hash({
      password: input.password,
    });

    const user = this.userRepository.create({
      email: input.email,
      password: hash,
      salt,
    });

    const saved = await this.userRepository.save(user);

    this.logger.info('User registered', {
      userId: saved.id,
    });

    return saved;
  }

  @LogResolver()
  async createUser(data: Partial<UserEntity>): Promise<IUserEntity> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  @LogResolver()
  async updateRefreshTokenVersion(
    params: UpdateRefreshTokenVersionParams,
  ): Promise<void> {
    await this.userRepository.update(params.userId, {
      refreshTokenVersion: params.version,
    });
  }
}
