import { describe, it, expect } from 'vitest';
import { CityService } from './CityService';

describe('CityService.normalizeCityName', () => {
  it('should trim and lowercase city name', () => {
    expect(CityService.normalizeCityName('  Kyiv ')).toBe('kyiv');
  });

  it('should handle mixed case', () => {
    expect(CityService.normalizeCityName('NeW YoRk')).toBe('new york');
  });
});

describe('CityService.isCityNameValid', () => {
  it('should return false for empty string', () => {
    expect(CityService.isCityNameValid('   ')).toBe(false);
  });

  it('should return true for valid city', () => {
    expect(CityService.isCityNameValid('Kyiv')).toBe(true);
  });
});

describe('CityService.isCityAlreadyAdded', () => {
  const cities = [{ city: 'kyiv' }, { city: 'london' }];

  it('should return true if city already exists (case insensitive)', () => {
    expect(CityService.isCityAlreadyAdded(cities, 'KYIV')).toBe(true);
  });

  it('should return false if city does not exist', () => {
    expect(CityService.isCityAlreadyAdded(cities, 'Paris')).toBe(false);
  });
});

describe('CityService.validateBeforeAdd', () => {
  const cities = [{ city: 'kyiv' }, { city: 'london' }];

  it('should reject empty input', () => {
    const result = CityService.validateBeforeAdd('   ', cities);

    expect(result).toEqual({
      ok: false,
      code: 'INVALID_CITY',
    });
  });

  it('should reject already existing city', () => {
    const result = CityService.validateBeforeAdd('Kyiv', cities);

    expect(result).toEqual({
      ok: false,
      code: 'CITY_EXISTS',
    });
  });

  it('should accept valid new city', () => {
    const result = CityService.validateBeforeAdd('  Paris ', cities);

    expect(result).toEqual({
      ok: true,
      city: 'paris',
    });
  });

  it('should normalize city before returning success', () => {
    const result = CityService.validateBeforeAdd('  NeW YoRk ', []);

    expect(result).toEqual({
      ok: true,
      city: 'new york',
    });
  });
});
