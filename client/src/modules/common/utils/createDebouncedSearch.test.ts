import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createDebouncedSearch } from './createDebouncedSearch';

describe('createDebouncedSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls callback after delay', () => {
    const callback = vi.fn();
    const debouncedSearch = createDebouncedSearch({
      delay: 300,
      minQueryLength: 3,
    });

    debouncedSearch(callback, 'kyiv');

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);

    expect(callback).toHaveBeenCalledWith('kyiv');
  });

  it('does not call callback when query is too short', () => {
    const callback = vi.fn();
    const debouncedSearch = createDebouncedSearch({
      delay: 300,
      minQueryLength: 3,
    });

    debouncedSearch(callback, 'ky');
    vi.runAllTimers();

    expect(callback).not.toHaveBeenCalled();
  });

  it('cancels previous pending search', () => {
    const callback = vi.fn();
    const debouncedSearch = createDebouncedSearch({
      delay: 300,
      minQueryLength: 3,
    });

    debouncedSearch(callback, 'kyi');
    debouncedSearch(callback, 'kyiv');

    vi.advanceTimersByTime(300);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('kyiv');
  });

  it('clears pending search when next query is too short', () => {
    const callback = vi.fn();
    const debouncedSearch = createDebouncedSearch({
      delay: 300,
      minQueryLength: 3,
    });

    debouncedSearch(callback, 'kyiv');
    debouncedSearch(callback, 'ky');
    vi.runAllTimers();

    expect(callback).not.toHaveBeenCalled();
  });
});
