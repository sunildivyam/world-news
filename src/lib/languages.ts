export const supportedLanguages = ["en", "fr", "es", "de", "hi"];
export const languageMap: Record<string, string> = {
  en: "english",
  fr: "french",
  es: "spanish",
  de: "german",
  hi: "hindi",
};
export const defaultLanguage = "en";

export const shortLanguage = (lang: string) => {
  if (supportedLanguages.includes(lang)) {
    return lang;
  }

  return (lang && languageMap[lang.toLowerCase()]) || "";
};
