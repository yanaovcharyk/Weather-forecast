import { fireEvent, render, screen } from '@testing-library/react';
import { ToastProvider } from './ToastProvider';
import { useContext } from 'react';
import { ToastContext } from '@/common/contexts/ToastContext';

const successMock = vi.fn();
const errorMock = vi.fn();
const warningMock = vi.fn();
const infoMock = vi.fn();

vi.mock('antd', async () => {
  const actual = await vi.importActual<typeof import('antd')>('antd');

  return {
    ...actual,
    App: {
      useApp: () => ({
        message: {
          success: successMock,
          error: errorMock,
          warning: warningMock,
          info: infoMock,
        },
      }),
    },
  };
});

const Consumer = () => {
  const context = useContext(ToastContext)!;

  return (
    <button onClick={() => context.toast('success', 'Saved')}>Trigger</button>
  );
};

describe('ToastProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children', () => {
    render(
      <ToastProvider>
        <div>Content</div>
      </ToastProvider>,
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should invoke success toast when requested', () => {
    render(
      <ToastProvider>
        <Consumer />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole('button'));

    expect(successMock).toHaveBeenCalledWith('Saved');
  });

  it('should expose toast function through context', () => {
    const Probe = () => {
      const context = useContext(ToastContext);

      return <div data-testid="has-toast">{typeof context?.toast}</div>;
    };

    render(
      <ToastProvider>
        <Probe />
      </ToastProvider>,
    );

    expect(screen.getByTestId('has-toast')).toHaveTextContent('function');
  });
});
