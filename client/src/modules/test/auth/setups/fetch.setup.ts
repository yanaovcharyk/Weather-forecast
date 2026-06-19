import { createFetchMock } from '../mocks/fetch.mock';

export const setupFetch = <T>(data: T) => {
  globalThis.fetch = createFetchMock(data);
};
