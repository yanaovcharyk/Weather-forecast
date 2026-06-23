import { render, screen } from '@testing-library/react';
import { AppText } from './AppText';

describe('AppText', () => {
  it('should render text', () => {
    render(<AppText>Hello</AppText>);

    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should render strong text', () => {
    render(<AppText strong>Hello</AppText>);

    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should render underlined text', () => {
    const { container } = render(<AppText underline>Hello</AppText>);

    expect(container.querySelector('[class*=underline]')).toBeInTheDocument();
  });
});
