import { render, renderHook } from '@testing-library/react';
import { createTestProviders } from '../providers/TestProvider';
import type { AuthContextType } from '../mocks/auth.mock';

const wrapper = createTestProviders();

export const testRender = (ui: React.ReactElement) => render(ui, { wrapper });

export const testRenderHook = <TProps, TResult>(
  hook: (props: TProps) => TResult,
  options?: { auth?: Partial<AuthContextType> },
) => {
  const wrapper = createTestProviders(options);
  return renderHook(hook, { wrapper });
};
