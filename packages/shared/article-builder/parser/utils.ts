export function cleanText(text: string): string {
  return text.replace(/\u00A0/g, " ").replace(/\s+/g, " ");
  // .trim();
}

export function isWhitespace(text: string) {
  return cleanText(text).length === 0;
}
