import { fetchNewAccessToken } from './fetchNewAccessToken';
import { config } from '@/common/config';

describe('fetchNewAccessToken', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('sends correct fetch request', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({ data: { refreshTokens: { success: true } } }),
    });
    globalThis.fetch = mockFetch as unknown as typeof fetch;

    await fetchNewAccessToken();

    expect(mockFetch).toHaveBeenCalledWith(
      config.apiBaseUrl + config.graphqlPath,
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  });

  it('returns true on success', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({ data: { refreshTokens: { success: true } } }),
    }) as unknown as typeof fetch;

    const result = await fetchNewAccessToken();
    expect(result).toBe(true);
  });

  it('returns false on failure', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({ data: { refreshTokens: { success: false } } }),
    }) as unknown as typeof fetch;

    const result = await fetchNewAccessToken();
    expect(result).toBe(false);
  });

  it('returns false when data is missing', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({}),
    }) as unknown as typeof fetch;

    const result = await fetchNewAccessToken();
    expect(result).toBe(false);
  });
});
