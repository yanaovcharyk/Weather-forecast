import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '@users/entities';
import { UserService } from '@users/services/user.service';
import { AppLoggerService } from '@logger/services';
import { createLoggerMock } from '@shared/testing/mocks/logger.mock';
import { UserAuthEntity } from '@auth/entities';
import { Pbkdf2PasswordHasher } from '@auth/services/password-hasher.service';
import { createPasswordHasherMock } from '@auth/testing/mocks';

export function createUserRepositoryMock() {
  return {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    increment: jest.fn(),
  };
}

export type UserServiceTestContext = {
  service: UserService;
  repo: ReturnType<typeof createUserRepositoryMock>;
  authRepo: ReturnType<typeof createUserRepositoryMock>;
  passwordHasher: ReturnType<typeof createPasswordHasherMock>;
  logger: ReturnType<typeof createLoggerMock>;
};

export async function createUserServiceContext(): Promise<UserServiceTestContext> {
  const repo = createUserRepositoryMock();
  const authRepo = createUserRepositoryMock();
  const passwordHasher = createPasswordHasherMock();
  const logger = createLoggerMock();

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      UserService,
      { provide: getRepositoryToken(UserEntity), useValue: repo },
      { provide: getRepositoryToken(UserAuthEntity), useValue: authRepo },
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
    authRepo,
    passwordHasher,
    logger,
  };
}
