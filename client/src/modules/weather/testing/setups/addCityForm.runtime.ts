import { vi } from 'vitest';

import { useIsMobile } from '@/common/hooks/useIsMobile';
import { useAddCityAction, useAddCityForm } from '@/weather/hooks';
import { createUseAddCityFormResult } from '@/weather/testing/mocks';

export const setupAddCityFormRuntime = ({
  isAddingCity = false,
  isMobile = false,
}: {
  isAddingCity?: boolean;
  isMobile?: boolean;
} = {}) => {
  vi.clearAllMocks();

  vi.mocked(useIsMobile).mockReturnValue(isMobile);

  vi.mocked(useAddCityAction).mockReturnValue({
    handleAddCity: vi.fn(),
    isAddingCity,
  });

  vi.mocked(useAddCityForm).mockReturnValue(createUseAddCityFormResult());
};
