import { beforeEach, describe, expect, it } from 'vitest';

import { loggerContext } from './LoggerContextStore';

describe('LoggerContextStore', () => {
  beforeEach(() => {
    loggerContext.clear();
  });

  it('returns empty context by default', () => {
    expect(loggerContext.get()).toEqual({});
  });

  it('stores provided context values', () => {
    loggerContext.set({
      route: '/weather',
    });

    expect(loggerContext.get()).toEqual({
      route: '/weather',
    });
  });

  it('merges new values with existing context', () => {
    loggerContext.set({
      route: '/weather',
    });

    loggerContext.set({
      sessionId: '123',
    });

    expect(loggerContext.get()).toEqual({
      route: '/weather',
      sessionId: '123',
    });
  });

  it('clears all stored values', () => {
    loggerContext.set({
      route: '/weather',
      sessionId: '123',
    });

    loggerContext.clear();

    expect(loggerContext.get()).toEqual({});
  });

  it('returns cloned object instead of reference', () => {
    loggerContext.set({
      route: '/weather',
    });

    const context = loggerContext.get();

    context.route = '/modified';

    expect(loggerContext.get()).toEqual({
      route: '/weather',
    });
  });
});
