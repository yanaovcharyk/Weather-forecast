import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { BackToAllCitiesButton } from './BackToAllCitiesButton';

const routerMocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  searchParams: new URLSearchParams('sortBy=cityName'),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();

  return {
    ...actual,
    useNavigate: () => routerMocks.navigate,
    useSearchParams: () => [routerMocks.searchParams, vi.fn()],
  };
});

vi.mock('@/common/components', () => ({
  AppCard: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe('BackToAllCitiesButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('navigates back preserving current search params', async () => {
    const user = userEvent.setup();

    render(<BackToAllCitiesButton />);

    await user.click(
      screen.getByRole('button', {
        name: '← Back to all cities',
      }),
    );

    expect(routerMocks.navigate).toHaveBeenCalledWith('/?sortBy=cityName');
  });
});
