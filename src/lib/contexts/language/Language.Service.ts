import { countryList } from "@/app-constants/countries.constant";
import { City, Country, Region } from "@/types/CountryList.interface";

type MapEntity = Country | Region | City;

const languages = (countryCode: string): Map<string, string> => {
  const langs = new Map();
  const setLanguages = (entities: MapEntity[]) => {
    if (!entities?.length) return;
    entities.forEach((e: MapEntity) => {
      if (e["languages"]?.length) {
        e["languages"].forEach((l) => langs.set(l.code, l.name));
      }

      const regions: MapEntity[] = (e as any)["regions"];
      const cities: MapEntity[] = (e as any)["cities"];

      if (regions?.length) {
        setLanguages(regions);
      }

      if (cities?.length) {
        setLanguages(cities);
      }
    });
  };

  const country = countryList.find(
    (c) => c.code.toLowerCase() === countryCode.toLowerCase(),
  );
  if (!country) return langs;

  country.languages.forEach((l) => langs.set(l.code, l.name));
  setLanguages(country.regions);

  return langs;
};

export const isLanguage = (
  countryCode: string,
  languageCode: string,
): boolean => {
  return languages(countryCode).has(languageCode);
};
