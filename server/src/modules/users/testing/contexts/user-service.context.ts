import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '@users/entities';
import { UserService } from '@users/services/user.service';
import { Pbkdf2PasswordHasher } from '@auth/services';
import { AppLoggerService } from '@logger/services';
import { createLoggerMock } from '@shared/testing/mocks/logger.mock';

export function createUserRepositoryMock() {
  return {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };
}

export function createPasswordHasherMock() {
  return {
    hash: jest.fn(),
  };
}

export type UserServiceTestContext = {
  service: UserService;
  repo: ReturnType<typeof createUserRepositoryMock>;
  passwordHasher: ReturnType<typeof createPasswordHasherMock>;
  logger: ReturnType<typeof createLoggerMock>;
};

export async function createUserServiceContext(): Promise<UserServiceTestContext> {
  const repo = createUserRepositoryMock();
  const passwordHasher = createPasswordHasherMock();
  const logger = createLoggerMock();

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      UserService,
      { provide: getRepositoryToken(UserEntity), useValue: repo },
      { provide: Pbkdf2PasswordHasher, useValue: passwordHasher },
      {
        provide: AppLoggerService,
        useValue: { child: jest.fn().mockReturnValue(logger) },
      },
    ],
  }).compile();

  return {
    service: module.get(UserService),
    repo,
    passwordHasher,
    logger,
  };
}
