export class CityService {
  static normalizeCityName(name: string): string {
    return name.trim().toLowerCase();
  }

  static isCityNameValid(name: string): boolean {
    return this.normalizeCityName(name).length > 0;
  }

  static isCityAlreadyAdded(cities: { city: string }[], city: string): boolean {
    const normalized = this.normalizeCityName(city);

    return cities.some(
      (city) => this.normalizeCityName(city.city) === normalized,
    );
  }

  // static isCityLimitReached(cities: unknown[], limit = 10): boolean {
  //   return cities.length >= limit;
  // }

  static validateBeforeAdd(input: string, cities: { city: string }[]) {
    if (!this.isCityNameValid(input)) {
      return { ok: false as const, code: 'INVALID_CITY' };
    }

    if (this.isCityAlreadyAdded(cities, input)) {
      return { ok: false as const, code: 'CITY_EXISTS' };
    }

    // if (this.isCityLimitReached(cities)) {
    //   return { ok: false as const, code: 'CITY_LIMIT' };
    // }

    return {
      ok: true as const,
      city: this.normalizeCityName(input),
    };
  }
}
