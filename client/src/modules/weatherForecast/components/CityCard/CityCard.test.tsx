import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { CityCard } from './CityCard';
import { useSmartBackground } from '@/common/hooks';
import type { Weather } from '../../types';

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
  const weather = {
    temperature: 20,
    description: 'Sunny',
    min: 10,
    max: 25,
    next3Days: [],
  };

  beforeEach(() => {
    vi.mocked(useSmartBackground).mockReturnValue({
      loaded: true,
    });
  });

  it('renders city and weather', () => {
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

  it('calls onClick', async () => {
    const user = userEvent.setup();

    const onClick = vi.fn();

    render(
      <CityCard
        city="Kyiv"
        weather={weather as Weather}
        isPinned={false}
        onTogglePinned={vi.fn()}
        onRemove={vi.fn()}
        onClick={onClick}
      />,
    );

    await user.click(screen.getByText('Kyiv'));

    expect(onClick).toHaveBeenCalled();
  });

  it('renders skeleton when background not loaded', () => {
    vi.mocked(useSmartBackground).mockReturnValue({
      loaded: false,
    });

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
});
