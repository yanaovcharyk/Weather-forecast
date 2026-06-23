import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BlurLoaderOverlay } from './BlurLoaderOverlay';

describe('BlurLoaderOverlay', () => {
  it('renders children', () => {
    render(
      <BlurLoaderOverlay loading={false}>
        <div data-testid="child">content</div>
      </BlurLoaderOverlay>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('shows overlay when loading is true', () => {
    const { container } = render(
      <BlurLoaderOverlay loading={true}>
        <div>content</div>
      </BlurLoaderOverlay>,
    );

    const overlay = container.children[0].children[1]; // 👈 overlay div

    expect(overlay.className.includes('hidden')).toBe(false);
    expect(container.querySelector('.ant-spin')).toBeTruthy();
  });

  it('hides overlay when loading is false', () => {
    const { container } = render(
      <BlurLoaderOverlay loading={false}>
        <div>content</div>
      </BlurLoaderOverlay>,
    );

    const overlay = container.children[0].children[1]; // 👈 overlay div

    expect(overlay.className.includes('hidden')).toBe(true);
    expect(container.querySelector('.ant-spin')).toBeTruthy(); // Spin все одно рендериться
  });
});
