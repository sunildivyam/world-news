import { City } from "./City.interface";
import { LanguageContext } from "./LanguageContext.type";
import { Region } from "./Region.interface";

export interface Country {
  id?: string;
  code: string;
  name: string; // common name
  capital?: City;
  regions: Array<Region>;
  languages: Array<LanguageContext>;
  createdAt?: Date | string;
  updatesAt?: Date | string;
}
