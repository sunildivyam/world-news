import { City } from "./City.interface";
import { LanguageContext } from "./LanguageContext.type";

export interface Region {
  code: string;
  name: string;
  cities: Array<City>;
  languages: Array<LanguageContext>;
}
