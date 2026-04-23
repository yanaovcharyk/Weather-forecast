import { Injectable, UnauthorizedException } from '@nestjs/common';
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

  async findByIdOrThrow(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.findByEmail(email);

    if (
      !user ||
      !(await this.passwordHasher.compare(password, user.password, user.salt))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
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

  async incrementRefreshTokenVersion(userId: string): Promise<number> {
    await this.userRepository.increment(
      { id: userId },
      'refreshTokenVersion',
      1,
    );

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user.refreshTokenVersion;
  }

  async createUser(data: Partial<UserEntity>): Promise<UserEntity> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }
}
