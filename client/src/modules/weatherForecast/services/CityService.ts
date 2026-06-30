export class CityService {
  static normalizeCityName(name: string): string {
    return name.trim().toLowerCase();
  }

  static isCityNameValid(name: string): boolean {
    return this.normalizeCityName(name).length > 0;
  }

  static isCityAlreadyAdded(
    cities: { cityName: string }[],
    cityName: string,
  ): boolean {
    const normalized = this.normalizeCityName(cityName);

    return cities.some(
      (city) => this.normalizeCityName(city.cityName) === normalized,
    );
  }

  static validateBeforeAdd(input: string, cities: { cityName: string }[]) {
    if (!this.isCityNameValid(input)) {
      return { ok: false as const, code: 'INVALID_CITY' };
    }

    if (this.isCityAlreadyAdded(cities, input)) {
      return { ok: false as const, code: 'CITY_EXISTS' };
    }

    return {
      ok: true as const,
      cityName: this.normalizeCityName(input),
    };
  }
}
