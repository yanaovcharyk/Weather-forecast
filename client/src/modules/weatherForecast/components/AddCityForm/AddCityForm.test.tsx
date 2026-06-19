import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { AddCityForm } from './AddCityForm';
import { useAddCityForm } from '@/weatherForecast/hooks/useAddCityForm';
import { useIsMobile } from '@/common/hooks/useIsMobile';

vi.mock('@/weatherForecast/hooks/useAddCityForm');
vi.mock('@/common/hooks/useIsMobile');

vi.mock('antd', async () => {
  const actual = await vi.importActual<typeof import('antd')>('antd');

  const FormMock = ({
    children,
    onFinish,
  }: {
    children: React.ReactNode;
    onFinish?: () => void;
  }) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onFinish?.();
      }}
    >
      {children}
    </form>
  );

  FormMock.Item = ({ children }: { children: React.ReactNode }) => children;

  return {
    ...actual,
    Form: FormMock,
  };
});

describe('AddCityForm', () => {
  const onSubmit = vi.fn();

  const handleSubmit = vi.fn();
  const handleSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useIsMobile).mockReturnValue(false);

    vi.mocked(useAddCityForm).mockReturnValue({
      form: {
        getFieldError: vi.fn().mockReturnValue([]),
      } as never,
      loading: false,
      handleSearch,
      cityOptions: [
        {
          label: 'Kyiv',
          value: 'kyiv',
        },
      ],
      handleSubmit,
    });
  });

  it('renders select and submit button', () => {
    render(<AddCityForm onSubmit={onSubmit} disabled={false} />);

    expect(
      screen.getByRole('button', {
        name: /add/i,
      }),
    ).toBeInTheDocument();
  });

  it('calls form submit handler', async () => {
    const user = userEvent.setup();

    render(<AddCityForm onSubmit={onSubmit} disabled={false} />);

    await user.click(
      screen.getByRole('button', {
        name: /add/i,
      }),
    );

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('disables button when disabled prop passed', () => {
    render(<AddCityForm onSubmit={onSubmit} disabled />);

    expect(
      screen.getByRole('button', {
        name: /add/i,
      }),
    ).toBeDisabled();
  });
});
