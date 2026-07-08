import { render, screen } from '@testing-library/react';
import { ThemeProvider } from './ThemeProvider';
import styles from './ThemeProvider.module.scss';

describe('ThemeProvider', () => {
  it('should render children', () => {
    render(
      <ThemeProvider>
        <div>Content</div>
      </ThemeProvider>,
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should render theme root wrapper', () => {
    const { container } = render(
      <ThemeProvider>
        <div />
      </ThemeProvider>,
    );

    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper).toHaveClass(styles.themeRoot);
  });
});
