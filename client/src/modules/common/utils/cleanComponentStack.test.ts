import { describe, expect, it } from 'vitest';
import { cleanComponentStack } from './cleanComponentStack';

describe('cleanComponentStack', () => {
  it('returns empty array when stack is undefined', () => {
    expect(cleanComponentStack()).toEqual([]);
  });

  it('returns empty array when stack is null', () => {
    expect(cleanComponentStack(null)).toEqual([]);
  });

  it('trims and removes empty lines', () => {
    const stack = `
      ComponentA

      ComponentB
    `;

    expect(cleanComponentStack(stack)).toEqual(['ComponentA', 'ComponentB']);
  });

  it('removes unwanted library entries', () => {
    const stack = `
      ComponentA
      node_modules/test
      antd/Button
      react-router
      react-dom
      ComponentB
    `;

    expect(cleanComponentStack(stack)).toEqual(['ComponentA', 'ComponentB']);
  });
});
