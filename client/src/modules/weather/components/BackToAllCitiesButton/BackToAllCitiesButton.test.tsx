import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { BackToAllCitiesButton } from './BackToAllCitiesButton';

const routerMocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  searchParams: new URLSearchParams('existingId=1&sortBy=cityName'),
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
  StyledCard: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const setup = () => {
  const user = userEvent.setup();

  render(<BackToAllCitiesButton />);

  return {
    user,
    backButton: screen.getByRole('button', {
      name: '← Back to all cities',
    }),
  };
};

describe('BackToAllCitiesButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('navigates back preserving params without existing city selection', async () => {
    const { user, backButton } = setup();

    await user.click(backButton);

    expect(routerMocks.navigate).toHaveBeenCalledWith('/?sortBy=cityName');
  });

  it('navigates to root when existing city selection is the only param', async () => {
    routerMocks.searchParams = new URLSearchParams('existingId=1');

    const { user, backButton } = setup();

    await user.click(backButton);

    expect(routerMocks.navigate).toHaveBeenCalledWith('/');
  });
});
