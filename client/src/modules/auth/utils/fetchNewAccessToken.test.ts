import { fetchNewAccessToken } from './fetchNewAccessToken';
import { config } from '@/common/config';
import {
  REFRESH_EMPTY_RESPONSE,
  REFRESH_FAIL_RESPONSE,
  REFRESH_SUCCESS_RESPONSE,
} from '../../test/auth/fixtures/fetch.fixture';
import { createFetchMock } from '../../test/auth/mocks/fetch.mock';

describe('fetchNewAccessToken', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('sends correct fetch request', async () => {
    globalThis.fetch = createFetchMock(REFRESH_SUCCESS_RESPONSE);

    await fetchNewAccessToken();

    expect(globalThis.fetch).toHaveBeenCalledWith(
      config.apiBaseUrl + config.graphqlPath,
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );
  });

  it('returns true on success', async () => {
    globalThis.fetch = createFetchMock(REFRESH_SUCCESS_RESPONSE);

    const result = await fetchNewAccessToken();

    expect(result).toBe(true);
  });

  it('returns false on failure', async () => {
    globalThis.fetch = createFetchMock(REFRESH_FAIL_RESPONSE);

    const result = await fetchNewAccessToken();

    expect(result).toBe(false);
  });

  it('returns false when data is missing', async () => {
    globalThis.fetch = createFetchMock(REFRESH_EMPTY_RESPONSE);

    const result = await fetchNewAccessToken();

    expect(result).toBe(false);
  });
});
