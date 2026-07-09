import { fetchNewAccessToken } from './fetchNewAccessToken';
import { config } from '@/common/config';
import {
  REFRESH_EMPTY_RESPONSE,
  REFRESH_FAIL_RESPONSE,
  REFRESH_SUCCESS_RESPONSE,
} from '@/auth/testing/fixtures';
import { createFetchMock } from '@/auth/testing/mocks';

describe('fetchNewAccessToken', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('sends correct fetch request', async () => {
    globalThis.fetch = createFetchMock(REFRESH_SUCCESS_RESPONSE);

    await fetchNewAccessToken();

    const [url, options] = vi.mocked(globalThis.fetch).mock.calls[0];
    const headers = options?.headers as Headers;

    expect(url).toBe(config.apiBaseUrl + config.graphqlPath);
    expect(options).toEqual(
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        keepalive: true,
      }),
    );
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(JSON.parse(options?.body as string)).toEqual({
      query: expect.any(String),
    });
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
