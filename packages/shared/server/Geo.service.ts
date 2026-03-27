import type { Country, GeoContext, Region, City, Language } from "../types";

import {
  fetchAddGeo,
  fetchCountries,
  fetchCountry,
  fetchLanguages,
} from "../news-engine-apis";

export class GeoService {
  cachedCountries: Country[] = [];
  cachedLanguages: Language[] = [];

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
    const l = city?.languages?.includes(language)
      ? language
      : region?.languages?.includes(language)
        ? language
        : country?.languages?.includes(language)
          ? language
          : "";
    return l;
  }

  async addGeotoDB(geoContext: GeoContext): Promise<void> {
    await fetchAddGeo(geoContext);
  }

  async isCountryExist(code: string): Promise<Country | null> {
    if (!code?.length) return null;
    // get countries from class cachedCountries
    if (!this.cachedCountries?.length) {
      this.cachedCountries = (await fetchCountries()) || [];
    }
    // if country exists in cache then fetch whole country tree. to avoid api calls on invalid country codes
    const matched = this.cachedCountries.find((c) => c.code === code); // verifies the code validity

    if (matched) {
      const foundCountry = await fetchCountry(code);
      if (foundCountry) return foundCountry;
    }

    return null;
  }

  async getCountryCode(name: string): Promise<string> {
    if (!name?.length) return "";
    if (!this.cachedCountries?.length) {
      this.cachedCountries = (await fetchCountries()) || [];
    }

    // verify if name exists in cache
    const matched = this.cachedCountries.find(
      (c) => (c.name || "").toLowerCase() === (name || "").toLowerCase(),
    );

    // if not in cache fetch from
    if (matched) {
      return matched.code;
    }

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
    if (!this.cachedLanguages) this.cachedLanguages = await fetchLanguages();

    if (isoMatch.length === 2) {
      found = this.cachedLanguages.find((l) => l.code2 === isoMatch);
    } else if (isoMatch.length === 3) {
      found = this.cachedLanguages.find((l) => l.code === isoMatch);
    } else {
      found = this.cachedLanguages.find((l) => l.name === cleanInput);
    }

    return found?.code2 || "";
  }
}
export const geoService = new GeoService();
