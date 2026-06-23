import { render, screen, fireEvent } from '@testing-library/react';
import { ScrollToTopButton } from './ScrollToTopButton';

describe('ScrollToTopButton', () => {
  beforeEach(() => {
    vi.stubGlobal('scrollTo', vi.fn());
  });

  it('should not render when page is near top', () => {
    Object.defineProperty(window, 'scrollY', {
      value: 100,
      writable: true,
    });

    render(<ScrollToTopButton />);

    fireEvent.scroll(window);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should render when page is scrolled more than 200px', () => {
    Object.defineProperty(window, 'scrollY', {
      value: 300,
      writable: true,
    });

    render(<ScrollToTopButton />);

    fireEvent.scroll(window);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should scroll to top after click', () => {
    Object.defineProperty(window, 'scrollY', {
      value: 300,
      writable: true,
    });

    render(<ScrollToTopButton />);

    fireEvent.scroll(window);

    fireEvent.click(screen.getByRole('button'));

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });
});
