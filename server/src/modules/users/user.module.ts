import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/';
import { UserService } from './services/user.service';
import { Pbkdf2PasswordHasher } from '@auth/services';

@Module({
  providers: [UserService, Pbkdf2PasswordHasher],
  imports: [TypeOrmModule.forFeature([UserEntity])],
  exports: [TypeOrmModule, UserService, Pbkdf2PasswordHasher],
})
export class UsersModule {}
