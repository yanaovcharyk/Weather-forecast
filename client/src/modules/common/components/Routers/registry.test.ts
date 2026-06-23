import { registry } from './registry';

describe('registry', () => {
  it('should export module collection', () => {
    expect(Array.isArray(registry)).toBe(true);
  });
});
