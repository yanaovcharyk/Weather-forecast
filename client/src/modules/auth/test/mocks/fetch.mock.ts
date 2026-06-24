export const createFetchMock = <T>(data: T) =>
  vi.fn().mockResolvedValue({
    json: () => Promise.resolve(data),
  }) as typeof fetch;
