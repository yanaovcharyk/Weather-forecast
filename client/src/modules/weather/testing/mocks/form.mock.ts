import type { FormInstance } from 'antd';

import type { AddCityFormValues } from '@/weather/hooks/useAddCityForm';

export const createFormMock = (
  errors: string[] = [],
): FormInstance<AddCityFormValues> =>
  ({
    getFieldError: vi.fn().mockReturnValue(errors),
    resetFields: vi.fn(),
  }) as unknown as FormInstance<AddCityFormValues>;
