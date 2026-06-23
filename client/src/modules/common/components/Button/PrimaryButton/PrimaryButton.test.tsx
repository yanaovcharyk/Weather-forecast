import { render, screen } from '@testing-library/react';
import { PrimaryButton } from './PrimaryButton';

describe('PrimaryButton', () => {
  it('should render children when not loading', () => {
    render(<PrimaryButton>Save</PrimaryButton>);

    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('should render default loading text when loading', () => {
    render(<PrimaryButton loading>Save</PrimaryButton>);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render custom loading text when loading', () => {
    render(
      <PrimaryButton loading loadingText="Saving...">
        Save
      </PrimaryButton>,
    );

    expect(screen.getByText('Saving...')).toBeInTheDocument();
  });
});
