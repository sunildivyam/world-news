/**
 * Priority:

 * route language
 * accept-language header
 * tenant default language

 * @param routeLang
 * @param tenantLang
 * @returns
 */

import { DEFAULT_LANGUAGE } from "@/app-constants/app-constants";
import { LanguageContext } from "@worldnews/shared/types";

export function resolveLanguageContext(
  routeLang: string | undefined,
  tenantLang: string,
  geoLang: string,
): LanguageContext {
  return routeLang || geoLang || tenantLang || DEFAULT_LANGUAGE;
}
