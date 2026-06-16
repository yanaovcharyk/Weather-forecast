import * as utils from '../utils/fetchNewAccessToken';
import { AccessTokenRefreshCoordinator } from './AccessTokenRefreshCoordinator';

describe('AccessTokenRefreshCoordinator', () => {
  let coordinator: AccessTokenRefreshCoordinator;

  beforeEach(() => {
    coordinator = new AccessTokenRefreshCoordinator();
    vi.restoreAllMocks();
  });

  it('executes queued operations on successful refresh', async () => {
    vi.spyOn(utils, 'fetchNewAccessToken').mockResolvedValue(true);

    const retryOp = vi.fn();
    coordinator.queueRetryOperation(retryOp);

    await coordinator.refreshAccessToken();

    expect(retryOp).toHaveBeenCalledTimes(1);
  });

  it('clears queued operations on failed refresh', async () => {
    vi.spyOn(utils, 'fetchNewAccessToken').mockResolvedValue(false);

    const retryOp = vi.fn();
    coordinator.queueRetryOperation(retryOp);

    await expect(coordinator.refreshAccessToken()).rejects.toThrow(
      'Access token refresh failed',
    );

    expect(retryOp).not.toHaveBeenCalled();
  });

  it('reuses active promise for concurrent calls', async () => {
    vi.spyOn(utils, 'fetchNewAccessToken').mockResolvedValue(true);

    const p1 = coordinator.refreshAccessToken();
    const p2 = coordinator.refreshAccessToken();

    expect(p1).toBe(p2);

    await p1;
  });
});
