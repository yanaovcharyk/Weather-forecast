import { fetchNewAccessToken } from '@/auth/utils/fetchNewAccessToken';

type RetryOperation = () => void;

export class AccessTokenRefreshCoordinator {
  private activeRefreshPromise: Promise<void> | null = null;
  private queuedRetryOperations: RetryOperation[] = [];

  refreshAccessToken(): Promise<void> {
    if (!this.activeRefreshPromise) {
      this.activeRefreshPromise = fetchNewAccessToken()
        .then((wasRefreshSuccessful) => {
          if (!wasRefreshSuccessful) {
            throw new Error('Access token refresh failed');
          }

          this.retryQueuedOperations();
        })
        .catch((error) => {
          this.clearQueuedOperations();
          throw error;
        })
        .finally(() => {
          this.activeRefreshPromise = null;
        });
    }

    return this.activeRefreshPromise;
  }

  queueRetryOperation(operation: RetryOperation) {
    this.queuedRetryOperations.push(operation);
  }

  private retryQueuedOperations() {
    this.queuedRetryOperations.forEach((retry) => retry());
    this.queuedRetryOperations = [];
  }

  private clearQueuedOperations() {
    this.queuedRetryOperations = [];
  }
}
