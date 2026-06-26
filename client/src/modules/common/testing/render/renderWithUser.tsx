import { render, type RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';

export const renderWithUser = (ui: ReactElement, options?: RenderOptions) => ({
  user: userEvent.setup(),
  ...render(ui, options),
});
