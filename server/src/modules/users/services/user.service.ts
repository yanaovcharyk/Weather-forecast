import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '@users/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { AppLoggerService } from '@logger/services';
import { CreateUserWithAuthParams, UserAuthParams } from '@users/types';
import { LogMethod } from '@logger/index';
import { UserAuthEntity } from '@auth/entities';
import { Pbkdf2PasswordHasher } from '@auth/services/password-hasher.service';
import { ICreateUserInput, IUserOutput } from '@users/interfaces';
import { IUserAuthOutput } from '@auth/interfaces';

@Injectable()
export class UserService {
  private readonly logger;

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserAuthEntity)
    private readonly userAuthRepository: Repository<UserAuthEntity>,
    private readonly passwordHasher: Pbkdf2PasswordHasher,
    loggerService: AppLoggerService,
  ) {
    this.logger = loggerService.child(UserService.name);
  }

  @LogMethod()
  async findByEmail(email: string): Promise<IUserOutput | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  @LogMethod()
  async findById(id: string): Promise<IUserOutput | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  @LogMethod()
  async createUserWithPassword(input: ICreateUserInput): Promise<IUserOutput> {
    const { hash, salt } = await this.passwordHasher.hash({
      password: input.password,
    });

    return this.createUserWithAuth({
      email: input.email,
      passwordHash: hash,
      salt,
    });
  }

  @LogMethod()
  private async createUserWithAuth(
    params: CreateUserWithAuthParams,
  ): Promise<IUserOutput> {
    const user = this.userRepository.create({
      email: params.email,
    });
    const savedUser = await this.userRepository.save(user);
    const userAuth = this.userAuthRepository.create({
      userId: savedUser.id,
      passwordHash: params.passwordHash,
      salt: params.salt,
    });

    await this.userAuthRepository.save(userAuth);

    this.logger.info('User created', {
      userId: savedUser.id,
    });

    return savedUser;
  }

  @LogMethod()
  async findAuthByUserId(
    params: UserAuthParams,
  ): Promise<IUserAuthOutput | null> {
    return this.userAuthRepository.findOne({
      where: { userId: params.userId },
    });
  }

  @LogMethod()
  async incrementRefreshTokenVersion(params: UserAuthParams): Promise<number> {
    await this.userAuthRepository.increment(
      { userId: params.userId },
      'refreshTokenVersion',
      1,
    );

    const userAuth = await this.findAuthByUserId(params);

    if (!userAuth) {
      throw new NotFoundException('User auth not found');
    }

    return userAuth.refreshTokenVersion;
  }
}
