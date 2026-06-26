import { Pbkdf2PasswordHasher } from '@auth/services/password-hasher.service';
import { AppLoggerService } from '@logger/services';
import { createLoggerMock } from '@test/mocks';
import { createContext } from '@test/utils/create-context';

export type PasswordHasherContext = {
  service: Pbkdf2PasswordHasher;
  logger: ReturnType<typeof createLoggerMock>;
};

export async function createPasswordHasherContext(): Promise<PasswordHasherContext> {
  const logger = createLoggerMock();

  const service = await createContext(
    Pbkdf2PasswordHasher,
    [
      {
        provide: AppLoggerService,
        useValue: logger,
      },
    ],
  );

  return {
    service,
    logger,
  };
}
