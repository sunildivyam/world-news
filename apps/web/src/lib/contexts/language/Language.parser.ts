/**
 * Normalizes various language strings (English, en-US, EN, uk-ua)
 * into a standard 2-letter ISO 639-1 code.
 */
export function parseLanguageCode(
  input: string | null | undefined,
): string | undefined {
  if (!input) return "en"; // Global fallback

  // 1. Clean the input: lowercase and trim
  const cleanInput = input.toLowerCase().trim();

  // 2. Handle full language names mapping
  // const nameMap: Record<string, string> = {
  //   english: "en",
  //   hindi: "hi",
  //   spanish: "es",
  //   french: "fr",
  //   marathi: "mr",
  //   bengali: "bn",
  //   portuguese: "pt",
  //   mandarin: "zh",
  //   chinese: "zh",
  //   japanese: "ja",
  //   german: "de",
  // };

  // if (nameMap[cleanInput]) {
  //   return nameMap[cleanInput];
  // }

  // 3. Handle locale strings (en-US, en_GB, hi-IN)
  // Split by hyphen or underscore and take the first part
  const isoMatch = cleanInput.split(/[-_]/)[0];

  // 4. Validate length (ISO 639-1 codes are 2 characters)
  // This prevents mapping "enterprise" to "en" accidentally
  if (isoMatch.length === 2) {
    return isoMatch;
  }

  return undefined; // Default fallback for unrecognized strings
}
