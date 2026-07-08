import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';

import { ProviderComposer, type ProviderEntry } from './ProviderComposer';

const OuterProvider = ({ children }: { children?: ReactNode }) => (
  <section data-testid="outer-provider">{children}</section>
);

const InnerProvider = ({ children }: { children?: ReactNode }) => (
  <div aria-label="inner provider">{children}</div>
);

describe('ProviderComposer', () => {
  it('renders providers from outermost to innermost', () => {
    const providers = [
      { component: OuterProvider, order: 10 },
      { component: InnerProvider, order: 20 },
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
