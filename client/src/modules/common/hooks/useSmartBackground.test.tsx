import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useSmartBackground } from './useSmartBackground';

describe('useSmartBackground', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('starts with loaded=false', () => {
    class MockImage {}

    vi.stubGlobal('Image', MockImage);

    const { result } = renderHook(() => useSmartBackground('test.jpg'));

    expect(result.current.loaded).toBe(false);
  });

  it('becomes loaded after image loads', async () => {
    class MockImage {
      onload: (() => void) | null = null;

      set src(_: string) {
        this.onload?.();
      }
    }

    vi.stubGlobal('Image', MockImage);

    const { result } = renderHook(() => useSmartBackground('test.jpg'));

    await waitFor(() => {
      expect(result.current.loaded).toBe(true);
    });
  });

  it('should not update loaded state after unmount', async () => {
    let triggerLoad: (() => void) | undefined;

    class MockImage {
      onload: (() => void) | null = null;

      set src(_: string) {
        triggerLoad = this.onload ?? undefined;
      }
    }

    vi.stubGlobal('Image', MockImage);

    const { result, unmount } = renderHook(() =>
      useSmartBackground('test.jpg'),
    );

    unmount();

    triggerLoad?.();

    expect(result.current.loaded).toBe(false);
  });
});
