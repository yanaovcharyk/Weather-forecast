import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/';
import { UserService } from './services/user.service';

@Module({
  providers: [UserService],
  imports: [TypeOrmModule.forFeature([UserEntity])],
  exports: [TypeOrmModule, UserService],
})
export class UsersModule {}
