import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '@users/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { AppLoggerService } from '@logger/services';
import { CreateUserParams } from '@users/types';
import { IUserEntity } from '@users/interfaces';
import { LogResolver } from '@logger/index';

@Injectable()
export class UserService {
  private readonly logger;

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
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
  async create(params: CreateUserParams): Promise<IUserEntity> {
    const user = this.userRepository.create(params);
    const savedUser = await this.userRepository.save(user);

    this.logger.info('User created', {
      userId: savedUser.id,
    });

    return savedUser;
  }

  @LogResolver()
  async incrementRefreshTokenVersion(userId: string): Promise<number> {
    await this.userRepository.increment(
      { id: userId },
      'refreshTokenVersion',
      1,
    );

    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.refreshTokenVersion;
  }
}
