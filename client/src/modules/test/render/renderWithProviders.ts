import { render, renderHook } from '@testing-library/react';
import { createTestProviders } from '../providers/TestProviders';

const wrapper = createTestProviders();

export const testRender = (ui: React.ReactElement) => render(ui, { wrapper });

export const testRenderHook = <TProps, TResult>(
  hook: (props: TProps) => TResult,
) => renderHook(hook, { wrapper });
