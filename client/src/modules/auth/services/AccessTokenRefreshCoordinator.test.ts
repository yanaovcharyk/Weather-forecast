import { fetchNewAccessToken } from '@/auth/utils/fetchNewAccessToken';
import { AccessTokenRefreshCoordinator } from './AccessTokenRefreshCoordinator';

vi.mock('@/auth/utils/fetchNewAccessToken', () => ({
  fetchNewAccessToken: vi.fn(),
}));

describe('AccessTokenRefreshCoordinator', () => {
  let coordinator: AccessTokenRefreshCoordinator;
  const fetchNewAccessTokenMock = vi.mocked(fetchNewAccessToken);

  beforeEach(() => {
    coordinator = new AccessTokenRefreshCoordinator();
    fetchNewAccessTokenMock.mockReset();
  });

  it('executes queued operations on successful refresh', async () => {
    fetchNewAccessTokenMock.mockResolvedValue(true);

    const retryOp = vi.fn();
    coordinator.queueRetryOperation(retryOp);

    await coordinator.refreshAccessToken();

    expect(retryOp).toHaveBeenCalledTimes(1);
  });

  it('clears queued operations on failed refresh', async () => {
    fetchNewAccessTokenMock.mockResolvedValue(false);

    const retryOp = vi.fn();
    coordinator.queueRetryOperation(retryOp);

    await expect(coordinator.refreshAccessToken()).rejects.toThrow(
      'Access token refresh failed',
    );

    expect(retryOp).not.toHaveBeenCalled();
  });

  it('reuses active promise for concurrent calls', async () => {
    fetchNewAccessTokenMock.mockResolvedValue(true);

    const p1 = coordinator.refreshAccessToken();
    const p2 = coordinator.refreshAccessToken();

    expect(p1).toBe(p2);

    await p1;
  });
});
