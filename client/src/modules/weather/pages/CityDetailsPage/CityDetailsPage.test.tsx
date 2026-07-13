import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ReactNode } from 'react';
import { CityDetailsPage } from './CityDetailsPage';

const navigate = vi.fn();

vi.mock('@/common/components', () => ({
  PageLayout: ({
    children,
    header,
  }: {
    children: ReactNode;
    header?: ReactNode;
  }) => (
    <div>
      {header}
      {children}
    </div>
  ),
  Header: () => <div>Header</div>,
}));

vi.mock('@/weather/components', () => ({
  BackToAllCitiesButton: () => (
    <button onClick={() => navigate('/?test=1')}>← Back to all cities</button>
  ),
  CurrentWeatherCard: () => <div>Current</div>,
  HourlyForecast: () => <div>Hourly</div>,
  DailyForecast: () => <div>Daily</div>,
}));

const setup = () => render(<CityDetailsPage />);

describe('CityDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders weather sections', () => {
    setup();

    ['Header', 'Current', 'Hourly', 'Daily'].forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it('navigates back on click', () => {
    setup();

    fireEvent.click(screen.getByText('← Back to all cities'));

    expect(navigate).toHaveBeenCalledWith('/?test=1');
  });
});
