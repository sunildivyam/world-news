import type { Country, GeoContext, Region, City } from "../types";

import {
  fetchAddGeo,
  fetchCountries,
  fetchCountry,
  fetchLanguage,
} from "../news-engine-apis";

export class GeoService {
  cache: Country[] = [];

  constructor() {}

  isRegionExist(country: Country, region: string): Region | null {
    if (!region) return null;
    return country.regions?.find((r) => r.code === region) || null;
  }

  isCityExist(region: Region, city: string): City | null {
    if (!city) return null;
    return region.cities?.find((c) => c.code === city) || null;
  }

  isLanguageExist(
    language: string,
    country?: Country,
    region?: Region,
    city?: City,
  ): string | "" {
    if (!language) return "";
    // check if language exist in any of the country, region or city.
    return city?.languages?.includes(language)
      ? language
      : region?.languages?.includes(language)
        ? language
        : country?.languages?.includes(language)
          ? language
          : "";
  }

  async addGeotoDB(geoContext: GeoContext): Promise<void> {
    await fetchAddGeo(geoContext);
  }

  async isCountryExist(code: string): Promise<Country | null> {
    if (!code?.length) return null;
    // get countries from class cache
    if (this.cache?.length) {
      this.cache = (await fetchCountries()) || [];
    }

    if (!this.cache.find((c) => c.code === code)) {
      const foundCountry = await fetchCountry(code);
      if (foundCountry) return foundCountry;
    }

    return null;
  }

  async getCountryCode(name: string): Promise<string> {
    if (!name?.length) return "";
    const foundCountry = await fetchCountry(undefined, name);
    if (foundCountry) return foundCountry.code;

    return "";
  }

  async getLanguageCode(lang: string): Promise<string> {
    if (!lang) return "";

    // 1. Clean the lang: lowercase and trim
    const cleanInput = lang.toLowerCase().trim();

    // 3. Handle locale strings (en-US, en_GB, hi-IN)
    // Split by hyphen or underscore and take the first part
    const isoMatch = cleanInput.split(/[-_]/)[0];

    // 4. Validate length (ISO 639-1 codes are 2 characters)
    // This prevents mapping "enterprise" to "en" accidentally
    let found;
    if (isoMatch.length === 2) {
      found = await fetchLanguage(isoMatch);
    } else if (isoMatch.length === 3) {
      found = await fetchLanguage(undefined, isoMatch);
    } else {
      found = await fetchLanguage(undefined, undefined, cleanInput);
    }

    return found?.code2 || "";
  }
}
export const geoService = new GeoService();
