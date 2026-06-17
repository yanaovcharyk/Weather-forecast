export const mockErrorUtils = () => {
  vi.mock('@/common/utils', () => ({
    extractErrorCode: vi.fn(),
    mapErrorCodeToMessage: vi.fn(),
  }));
};
