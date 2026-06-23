import { render, screen } from '@testing-library/react';
import { ThemeProvider } from './ThemeProvider';

describe('ThemeProvider', () => {
  it('should render children', () => {
    render(
      <ThemeProvider>
        <div>Content</div>
      </ThemeProvider>,
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should expose css variables wrapper', () => {
    const { container } = render(
      <ThemeProvider>
        <div />
      </ThemeProvider>,
    );

    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper.style.getPropertyValue('--radius')).toBe('8px');
  });

  it('should expose small shadow variable', () => {
    const { container } = render(
      <ThemeProvider>
        <div />
      </ThemeProvider>,
    );

    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper.style.getPropertyValue('--shadow-sm')).toContain('rgba');
  });
});
