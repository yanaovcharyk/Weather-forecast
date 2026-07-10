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

  return <button onClick={() => context.success('Saved')}>Trigger</button>;
};

const AllToastConsumer = () => {
  const context = useContext(ToastContext)!;

  return (
    <button
      onClick={() => {
        context.error('Failed');
        context.info('Heads up');
        context.warning('Careful');
        context.toast('success', 'Generic');
      }}
    >
      Trigger all
    </button>
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

      return (
        <div>
          <div data-testid="has-toast">{typeof context?.toast}</div>
          <div data-testid="has-error">{typeof context?.error}</div>
        </div>
      );
    };

    render(
      <ToastProvider>
        <Probe />
      </ToastProvider>,
    );

    expect(screen.getByTestId('has-toast')).toHaveTextContent('function');
    expect(screen.getByTestId('has-error')).toHaveTextContent('function');
  });

  it('should invoke all toast helpers', () => {
    render(
      <ToastProvider>
        <AllToastConsumer />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole('button'));

    expect(errorMock).toHaveBeenCalledWith('Failed');
    expect(infoMock).toHaveBeenCalledWith('Heads up');
    expect(warningMock).toHaveBeenCalledWith('Careful');
    expect(successMock).toHaveBeenCalledWith('Generic');
  });
});
