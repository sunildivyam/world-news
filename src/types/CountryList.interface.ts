export interface Country {
  code: string;
  name: string; // common name
  regions: Array<Region>;
  languages: Array<Language>;
}

export interface Region {
  code: string;
  name: string;
  cities: Array<City>;
  languages: Array<Language>;
}

export interface City {
  code: string;
  name: string;
  languages: Array<Language>;
}

export interface Language {
  code: string;
  name: string;
}

export type CountryList = Array<Country>;


