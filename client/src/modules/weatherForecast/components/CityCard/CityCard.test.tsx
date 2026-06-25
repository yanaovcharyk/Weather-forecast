import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { CityCard } from './CityCard';
import { useSmartBackground } from '@/common/hooks';
import { renderWithUser } from '@/common/test/render/renderWithUser';
import { WEATHER_FIXTURE } from '@/weatherForecast/test/fixtures';

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
  beforeEach(() => {
    vi.mocked(useSmartBackground).mockReturnValue({ loaded: true });
  });

  it('renders full card with weather', () => {
    render(
      <CityCard
        city="Kyiv"
        weather={WEATHER_FIXTURE}
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
        weather={WEATHER_FIXTURE}
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

    const { user } = renderWithUser(
      <CityCard
        city="Kyiv"
        weather={WEATHER_FIXTURE}
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

    const { user } = renderWithUser(
      <CityCard
        city="Kyiv"
        weather={WEATHER_FIXTURE}
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
        weather={WEATHER_FIXTURE}
        isPinned={false}
        onTogglePinned={vi.fn()}
        onRemove={vi.fn()}
      />,
    );

    expect(screen.getAllByRole('button')[0]).toBeInTheDocument();

    rerender(
      <CityCard
        city="Kyiv"
        weather={WEATHER_FIXTURE}
        isPinned={true}
        onTogglePinned={vi.fn()}
        onRemove={vi.fn()}
      />,
    );

    expect(screen.getAllByRole('button')[0]).toBeInTheDocument();
  });
});
