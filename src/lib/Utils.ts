export function parseLanguageCode(languageCode: string): string {
  return languageCode.split("-")[0].toLowerCase();
}
