import { render, screen, fireEvent } from '@testing-library/react';
import { ScrollToTopButton } from './ScrollToTopButton';
import {
  mockWindowScrollTo,
  mockWindowScrollY,
} from '@/common/test/mocks/browser.mock';

describe('ScrollToTopButton', () => {
  beforeEach(() => {
    mockWindowScrollTo();
  });

  it('should not render when page is near top', () => {
    mockWindowScrollY(100);

    render(<ScrollToTopButton />);

    fireEvent.scroll(window);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should render when page is scrolled more than 200px', () => {
    mockWindowScrollY(300);

    render(<ScrollToTopButton />);

    fireEvent.scroll(window);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should scroll to top after click', () => {
    mockWindowScrollY(300);

    render(<ScrollToTopButton />);

    fireEvent.scroll(window);

    fireEvent.click(screen.getByRole('button'));

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });
});
