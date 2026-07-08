import { appModules, providers, routes } from './registry';

describe('registry', () => {
  it('should export discovered modules and derived registries', () => {
    expect(Array.isArray(appModules)).toBe(true);
    expect(Array.isArray(routes)).toBe(true);
    expect(Array.isArray(providers)).toBe(true);
  });

  it('should sort providers by configured order', () => {
    expect(providers.map((provider) => provider.order)).toEqual(
      [...providers].map((provider) => provider.order).sort((a, b) => a - b),
    );
  });
});
