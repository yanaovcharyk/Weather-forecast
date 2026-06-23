import { render, screen } from '@testing-library/react';
import { EllipsisButton } from './EllipsisButton';

describe('EllipsisButton', () => {
  it('should render button', () => {
    render(<EllipsisButton />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should render icon button', () => {
    render(<EllipsisButton />);

    const button = screen.getByRole('button');

    expect(button.querySelector('span')).toBeTruthy();
  });
});
