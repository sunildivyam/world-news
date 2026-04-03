import type { Country, ArticleSource, Language } from "@worldnews/shared";
import fs from "fs/promises";

async function fetchCountries(): Promise<Country[]> {
  const response = await fetch("http://localhost:3001/api/countries");
  if (!response.ok) throw new Error("Failed to fetch countries");
  const result = await response.json();
  const items = result.data;
  return items;
}

async function fetchLanguages(): Promise<Language[]> {
  const response = await fetch("http://localhost:3001/api/languages");
  if (!response.ok) throw new Error("Failed to fetch languages");
  const result = await response.json();
  const items = result.data;
  return items;
}

export class GeoService {
  cachedCountries: Country[] = [];
  cachedLanguages: Language[] = [];

  constructor() {}

  async getCountryCode(name: string): Promise<string> {
    if (!name?.length) return "";
    if (!this.cachedCountries?.length) {
      this.cachedCountries = (await fetchCountries()) || [];
    }

    // verify if name exists in cache
    const matched =
      this.cachedCountries &&
      this.cachedCountries.find(
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
    if (!this.cachedLanguages?.length)
      this.cachedLanguages = await fetchLanguages();

    if (isoMatch.length === 2) {
      found =
        this.cachedLanguages &&
        this.cachedLanguages.find((l) => l.code2 === isoMatch);
    } else if (isoMatch.length === 3) {
      found =
        this.cachedLanguages &&
        this.cachedLanguages.find((l) => l.code === isoMatch);
    } else {
      found =
        this.cachedLanguages &&
        this.cachedLanguages.find(
          (l) => l.name.toLowerCase() === cleanInput.toLowerCase(),
        );
    }
    return found?.code2 || "";
  }
}

const geoService = new GeoService();

export async function readNewsSources() {
  const jsonPath = new URL("../data/news-sources.json", import.meta.url);
  const raw = await fs.readFile(jsonPath, "utf-8");
  return JSON.parse(raw) as unknown;
}

export async function parseSource(raw: any): Promise<ArticleSource> {
  const source: ArticleSource = {
    slug: raw.id,
    name: raw.name,
    description: raw.description,
    url: raw.url,
    iconUrl: raw.icon,
    imageUrl: "",
    category: raw.category || [],
    language:
      (await Promise.all(
        raw.language.map(
          async (l: string) => await geoService.getLanguageCode(l),
        ),
      )) || [],
    country:
      (await Promise.all(
        raw.country.map(
          async (l: string) => await geoService.getCountryCode(l),
        ),
      )) || [],
    totalArticles: 0,
    priority: raw.priority,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return source;
}

export async function createSources(): Promise<ArticleSource[]> {
  const sources: any = await readNewsSources();
  const pSources = await Promise.all(
    sources.map(async (s: any) => await parseSource(s)),
  );
  return pSources;
}

const sources = await createSources();
const outputPath = new URL("../data/parsed-sources.json", import.meta.url);
await fs.writeFile(outputPath, JSON.stringify(sources, null, 2), "utf-8");
console.log(sources.filter((s) => !s.language?.length || !s.country?.length));
