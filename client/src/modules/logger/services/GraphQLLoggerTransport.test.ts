import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GraphQLLoggerTransport } from './GraphQLLoggerTransport';
import { config } from '@/common/config';

describe('GraphQLLoggerTransport', () => {
  let transport: GraphQLLoggerTransport;

  beforeEach(() => {
    transport = new GraphQLLoggerTransport();

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));

    Object.defineProperty(navigator, 'sendBeacon', {
      value: vi.fn(),
      writable: true,
    });
  });

  it('does not send empty log batch', async () => {
    await transport.send([]);

    expect(fetch).not.toHaveBeenCalled();
  });

  it('sends logs through fetch', async () => {
    await transport.send([
      {
        message: 'event',
        metadata: {
          city: 'Kyiv',
        },
      },
    ] as never);

    const [url, options] = vi.mocked(fetch).mock.calls[0];
    const headers = options?.headers as Headers;
    const body = JSON.parse(options?.body as string);

    expect(url).toBe(config.loggerApiUrl);
    expect(options).toEqual(
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
      }),
    );
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(body.variables.input[0].metadata).toBe('{"city":"Kyiv"}');
  });

  it('throws when fetch fails', async () => {
    const networkError = new Error('Network error');

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(networkError));

    await expect(
      transport.send([
        {
          message: 'event',
        },
      ] as never),
    ).rejects.toThrow(networkError);
  });

  it('throws when logger response is not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    );

    await expect(
      transport.send([
        {
          message: 'event',
        },
      ] as never),
    ).rejects.toThrow('Failed to send logs: 500');
  });

  it('uses sendBeacon on page close', () => {
    transport.sendOnPageClose([
      {
        message: 'event',
      },
    ] as never);

    expect(navigator.sendBeacon).toHaveBeenCalledWith(
      config.loggerApiUrl,
      expect.any(String),
    );
  });

  it('does not send empty batch on page close', () => {
    transport.sendOnPageClose([]);

    expect(navigator.sendBeacon).not.toHaveBeenCalled();
  });
});
