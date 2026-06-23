import { render, screen } from '@testing-library/react';
import { PageLayout } from './PageLayout';

describe('PageLayout', () => {
  it('should render content', () => {
    render(
      <PageLayout>
        <div>Body</div>
      </PageLayout>,
    );

    expect(screen.getByText('Body')).toBeInTheDocument();
  });

  it('should render header when provided', () => {
    render(<PageLayout header={<div>Header</div>}>Body</PageLayout>);

    expect(screen.getByText('Header')).toBeInTheDocument();
  });

  it('should render footer when provided', () => {
    render(<PageLayout footer={<div>Footer</div>}>Body</PageLayout>);

    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});
