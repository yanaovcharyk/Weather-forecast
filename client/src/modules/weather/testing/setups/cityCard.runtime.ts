import { vi } from 'vitest';

import { useSmartBackground } from '@/common/hooks';
import type { CityCardRuntimeMocks } from '@/weather/testing/contexts/cityCard.context';

export const setupCityCardRuntime = (
  mocks: CityCardRuntimeMocks,
  {
    backgroundLoaded = true,
  }: {
    backgroundLoaded?: boolean;
  } = {},
) => {
  vi.clearAllMocks();

  mocks.searchParams = new URLSearchParams();
  mocks.removeCity.mockResolvedValue(undefined);
  mocks.togglePinned.mockResolvedValue(undefined);
  vi.mocked(useSmartBackground).mockReturnValue({ loaded: backgroundLoaded });
};
