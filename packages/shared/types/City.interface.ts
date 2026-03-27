import { LanguageContext } from "./LanguageContext.type";

export interface City {
  code: string;
  name: string;
  languages: Array<LanguageContext>;
}
