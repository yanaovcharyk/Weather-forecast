import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Pbkdf2PasswordHasher } from '@auth/services/password-hasher.service';
import { RegisterInput } from '@auth/dto';
import { AppLoggerService } from '@logger/services';

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

  async findByEmail(email: string): Promise<UserEntity | null> {
    this.logger.debug('findByEmail called', { email });
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<UserEntity | null> {
    this.logger.debug('findById called', { id });
    return this.userRepository.findOne({ where: { id } });
  }

  async register(input: RegisterInput): Promise<UserEntity> {
    this.logger.info('register called');
    this.logger.debug('register params', { email: input.email });

    const { hash, salt } = await this.passwordHasher.hash(input.password);

    const user = this.userRepository.create({
      email: input.email,
      password: hash,
      salt,
    });

    const saved = await this.userRepository.save(user);

    this.logger.info('User registered', { id: saved.id });

    return saved;
  }

  async createUser(data: Partial<UserEntity>): Promise<UserEntity> {
    this.logger.debug('createUser called');
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async updateRefreshTokenVersion(
    userId: string,
    version: number,
  ): Promise<void> {
    this.logger.info('updateRefreshTokenVersion called', { userId, version });

    await this.userRepository.update(userId, {
      refreshTokenVersion: version,
    });
  }
}
