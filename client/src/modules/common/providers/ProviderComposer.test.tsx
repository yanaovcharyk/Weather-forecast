import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';

import { ProviderComposer, type ProviderEntry } from './ProviderComposer';

const OuterProvider = ({ children }: { children?: ReactNode }) => (
  <section data-testid="outer-provider">{children}</section>
);

const LabelProvider = ({
  children,
  label,
}: {
  children?: ReactNode;
  label?: string;
}) => <div aria-label={label}>{children}</div>;

describe('ProviderComposer', () => {
  it('renders providers from outermost to innermost', () => {
    const providers = [
      { component: OuterProvider },
      { component: LabelProvider, props: { label: 'inner provider' } },
    ] satisfies readonly ProviderEntry[];

    render(
      <ProviderComposer providers={providers}>
        <span>Application</span>
      </ProviderComposer>,
    );

    expect(screen.getByTestId('outer-provider')).toContainElement(
      screen.getByLabelText('inner provider'),
    );
    expect(screen.getByText('Application')).toBeInTheDocument();
  });
});
