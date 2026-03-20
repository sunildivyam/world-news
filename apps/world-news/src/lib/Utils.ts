export function parseLanguageCode(languageCode: string): string {
  return languageCode.split("-")[0].toLowerCase();
}

export function getRandomIntInclusive(min: number, max: number): number {
  const lower = Math.ceil(min);
  const upper = Math.floor(max);
  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
}
