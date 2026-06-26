import { Test } from '@nestjs/testing';
import { Provider, Type } from '@nestjs/common';

export async function createContext<T>(
  service: Type<T>,
  providers: Provider[],
): Promise<T> {
  const moduleRef = await Test.createTestingModule({
    providers: [
      service,
      ...providers,
    ],
  }).compile();

  return moduleRef.get(service);
}
