import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { CitiesControls } from './CitiesControls';

describe('CitiesControls', () => {
  const setup = () => {
    const user = userEvent.setup();

    const setSorting = vi.fn();
    const setShowPinnedOnly = vi.fn();
    const onDeleteAll = vi.fn().mockResolvedValue(undefined);

    render(
      <CitiesControls
        sorting={{
          sortBy: 'city',
          sortOrder: 'ASC',
        }}
        setSorting={setSorting}
        onDeleteAll={onDeleteAll}
        showPinnedOnly={false}
        setShowPinnedOnly={setShowPinnedOnly}
        disabledStates={{
          sorting: false,
          deleteAll: false,
          pinnedFilter: false,
        }}
      />,
    );

    return {
      user,
      setSorting,
      setShowPinnedOnly,
      onDeleteAll,
    };
  };

  it('renders controls', () => {
    setup();

    expect(screen.getByText(/sort by/i)).toBeInTheDocument();
    expect(screen.getByText(/favourites only/i)).toBeInTheDocument();
  });

  it('toggles pinned filter', async () => {
    const { user, setShowPinnedOnly } = setup();

    await user.click(screen.getByText(/favourites only/i));

    expect(setShowPinnedOnly).toHaveBeenCalledWith(true);
  });

  it('opens confirmation modal', async () => {
    const { user } = setup();

    await user.click(
      screen.getByRole('button', {
        name: /delete all/i,
      }),
    );

    expect(screen.getByText(/delete all cities/i)).toBeInTheDocument();
  });

  it('confirms delete all', async () => {
    const { user, onDeleteAll } = setup();

    await user.click(
      screen.getByRole('button', {
        name: /delete all/i,
      }),
    );

    const modal = screen.getByRole('dialog');

    await user.click(
      within(modal).getByRole('button', {
        name: /delete all/i,
      }),
    );

    expect(onDeleteAll).toHaveBeenCalledTimes(1);
  });
});
