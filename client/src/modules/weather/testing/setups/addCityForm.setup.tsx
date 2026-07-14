import { screen } from '@testing-library/react';

import { renderWithUser } from '@/common/testing/render/renderWithUser';
import { AddCityForm } from '@/weather/components/AddCityForm/AddCityForm';

export const setupAddCityForm = () => ({
  ...renderWithUser(<AddCityForm />),
  getAddButton: () =>
    screen.getByRole('button', {
      name: /add/i,
    }),
  getSelect: () => screen.getByTestId('select'),
});
