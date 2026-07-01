import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '@users/entities';
import { UserService } from '@users/services/user.service';
import { AppLoggerService } from '@logger/services';
import { createLoggerMock } from '@shared/testing/mocks/logger.mock';

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
  logger: ReturnType<typeof createLoggerMock>;
};

export async function createUserServiceContext(): Promise<UserServiceTestContext> {
  const repo = createUserRepositoryMock();
  const logger = createLoggerMock();

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      UserService,
      { provide: getRepositoryToken(UserEntity), useValue: repo },
      {
        provide: AppLoggerService,
        useValue: { child: jest.fn().mockReturnValue(logger) },
      },
    ],
  }).compile();

  return {
    service: module.get(UserService),
    repo,
    logger,
  };
}
