import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GraphQLLoggerTransport } from './GraphQLLoggerTransport';

describe('GraphQLLoggerTransport', () => {
  let transport: GraphQLLoggerTransport;

  beforeEach(() => {
    transport = new GraphQLLoggerTransport();

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({}));

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

    expect(fetch).toHaveBeenCalled();
  });

  it('logs error when fetch fails', async () => {
    const networkError = new Error('Network error');

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(networkError));

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await transport.send([
      {
        message: 'event',
      },
    ] as never);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to send logs',
      networkError,
    );

    consoleErrorSpy.mockRestore();
  });

  it('uses sendBeacon on page close', () => {
    transport.sendOnPageClose([
      {
        message: 'event',
      },
    ] as never);

    expect(navigator.sendBeacon).toHaveBeenCalled();
  });

  it('does not send empty batch on page close', () => {
    transport.sendOnPageClose([]);

    expect(navigator.sendBeacon).not.toHaveBeenCalled();
  });
});
