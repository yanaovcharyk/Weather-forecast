import { removeUndefined } from './remove-undefined';

describe('removeUndefined', () => {
  it('should remove fields with undefined values', () => {
    const result = removeUndefined({
      cityName: 'Kyiv',
      lat: undefined,
      lon: 30.52,
      isPinned: undefined,
    });

    expect(result).toEqual({
      cityName: 'Kyiv',
      lon: 30.52,
    });
  });

  it('should keep falsy values that are not undefined', () => {
    const result = removeUndefined({
      emptyText: '',
      count: 0,
      enabled: false,
      value: null,
      missing: undefined,
    });

    expect(result).toEqual({
      emptyText: '',
      count: 0,
      enabled: false,
      value: null,
    });
  });

  it('should not mutate the original object', () => {
    const input = {
      cityName: 'Lviv',
      isPinned: undefined,
    };

    removeUndefined(input);

    expect(input).toEqual({
      cityName: 'Lviv',
      isPinned: undefined,
    });
  });
});
