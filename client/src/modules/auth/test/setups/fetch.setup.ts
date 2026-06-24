import { createFetchMock } from '@/auth/test/mocks/fetch.mock';

export const setupFetch = <T>(data: T) => {
  globalThis.fetch = createFetchMock(data);
};
