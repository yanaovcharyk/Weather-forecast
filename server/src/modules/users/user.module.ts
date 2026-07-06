import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/';
import { UserService } from './services/user.service';
import { UserAuthEntity } from '@auth/entities';
import { Pbkdf2PasswordHasher } from '@auth/services/password-hasher.service';

@Module({
  providers: [UserService, Pbkdf2PasswordHasher],
  imports: [TypeOrmModule.forFeature([UserEntity, UserAuthEntity])],
  exports: [TypeOrmModule, UserService],
})
export class UsersModule {}
