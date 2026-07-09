import { beforeEach, describe, expect, it, vi } from 'vitest';

import { postGraphQL, postJson, sendJsonBeacon } from './client';

describe('http client', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        json: () =>
          Promise.resolve({
            data: {
              ok: true,
            },
          }),
      }),
    );

    Object.defineProperty(navigator, 'sendBeacon', {
      value: vi.fn(),
      writable: true,
    });
  });

  it('posts json with shared request defaults', async () => {
    await postJson('/graphql', {
      query: 'query Test',
    });

    const [, options] = vi.mocked(fetch).mock.calls[0];
    const headers = options?.headers as Headers;

    expect(options).toEqual(
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
          query: 'query Test',
        }),
      }),
    );
    expect(headers.get('Content-Type')).toBe('application/json');
  });

  it('returns parsed graphql response', async () => {
    const response = await postGraphQL<{ ok: boolean }>('/graphql', {
      query: 'query Test',
    });

    expect(response).toEqual({
      data: {
        ok: true,
      },
    });
  });

  it('sends json through beacon', () => {
    sendJsonBeacon('/graphql', {
      query: 'mutation Test',
    });

    expect(navigator.sendBeacon).toHaveBeenCalledWith(
      '/graphql',
      JSON.stringify({
        query: 'mutation Test',
      }),
    );
  });
});
