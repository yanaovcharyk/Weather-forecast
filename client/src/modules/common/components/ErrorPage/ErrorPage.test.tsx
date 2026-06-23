vi.mock('../Header/Header', () => ({
  Header: () => <div>Mock Header</div>,
}));

import { render, screen } from '@testing-library/react';
import { ErrorPage } from './ErrorPage';

describe('ErrorPage', () => {
  it('should render error message', () => {
    render(<ErrorPage />);

    expect(screen.getByText('Technical work in progress.')).toBeInTheDocument();
  });

  it('should render retry description', () => {
    render(<ErrorPage />);

    expect(screen.getByText('Please try again later.')).toBeInTheDocument();
  });
});
