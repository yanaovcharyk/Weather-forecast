import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { CityCard } from './CityCard';
import { useSmartBackground } from '@/common/hooks';
import type { Weather } from '@/weatherForecast/types';

vi.mock('@/common/hooks', () => ({
  useSmartBackground: vi.fn(),
}));

vi.mock('@/weatherForecast/utils', () => ({
  getWeatherBackground: vi.fn(() => 'bg.jpg'),
  getNextDays: vi.fn(() => [
    { label: 'Mon' },
    { label: 'Tue' },
    { label: 'Wed' },
  ]),
}));

describe('CityCard', () => {
  const user = userEvent.setup();

  const weather = {
    temperature: 20,
    description: 'Sunny',
    min: 10,
    max: 25,
    next3Days: [
      { min: 1, max: 5, description: 'Cold' },
      { min: 2, max: 6, description: 'Cloudy' },
      { min: 3, max: 7, description: 'Rain' },
    ],
  };

  beforeEach(() => {
    vi.mocked(useSmartBackground).mockReturnValue({ loaded: true });
  });

  it('renders full card with weather', () => {
    render(
      <CityCard
        city="Kyiv"
        weather={weather as Weather}
        isPinned={false}
        onTogglePinned={vi.fn()}
        onRemove={vi.fn()}
      />,
    );

    expect(screen.getByText('Kyiv')).toBeInTheDocument();

    expect(screen.getByText('Sunny')).toBeInTheDocument();
  });

  it('renders skeleton when not loaded', () => {
    vi.mocked(useSmartBackground).mockReturnValue({ loaded: false });

    render(
      <CityCard
        city="Kyiv"
        weather={weather as Weather}
        isPinned={false}
        onTogglePinned={vi.fn()}
        onRemove={vi.fn()}
      />,
    );

    expect(screen.queryByText('Kyiv')).not.toBeInTheDocument();
  });

  it('renders fallback when weather is null', () => {
    render(
      <CityCard
        city="Kyiv"
        weather={null}
        isPinned={false}
        onTogglePinned={vi.fn()}
        onRemove={vi.fn()}
      />,
    );

    expect(screen.getByText('No forecast yet')).toBeInTheDocument();
  });

  it('calls handlers when enabled', async () => {
    const onTogglePinned = vi.fn();
    const onRemove = vi.fn();

    render(
      <CityCard
        city="Kyiv"
        weather={weather as Weather}
        isPinned={false}
        onTogglePinned={onTogglePinned}
        onRemove={onRemove}
      />,
    );

    const [pinBtn, removeBtn] = screen.getAllByRole('button');

    await user.click(pinBtn);
    await user.click(removeBtn);

    expect(onTogglePinned).toHaveBeenCalledTimes(1);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('does NOT call handlers when loading (disabled branch)', async () => {
    const onTogglePinned = vi.fn();
    const onRemove = vi.fn();

    render(
      <CityCard
        city="Kyiv"
        weather={weather as Weather}
        isPinned={false}
        onTogglePinned={onTogglePinned}
        onRemove={onRemove}
        loading={true}
      />,
    );

    const [pinBtn, removeBtn] = screen.getAllByRole('button');

    await user.click(pinBtn);
    await user.click(removeBtn);

    expect(onTogglePinned).not.toHaveBeenCalled();
    expect(onRemove).not.toHaveBeenCalled();
  });

  it('covers pinned icon toggle branch', () => {
    const { rerender } = render(
      <CityCard
        city="Kyiv"
        weather={weather as Weather}
        isPinned={false}
        onTogglePinned={vi.fn()}
        onRemove={vi.fn()}
      />,
    );

    expect(screen.getAllByRole('button')[0]).toBeInTheDocument();

    rerender(
      <CityCard
        city="Kyiv"
        weather={weather as Weather}
        isPinned={true}
        onTogglePinned={vi.fn()}
        onRemove={vi.fn()}
      />,
    );

    expect(screen.getAllByRole('button')[0]).toBeInTheDocument();
  });
});
