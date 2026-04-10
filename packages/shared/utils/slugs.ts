import { slugify } from "transliteration";

export function generateSlug(title: string) {
  return slugify(title, {
    lowercase: true,
    trim: true,
    separator: "-",
  });
}

/**
 * Converts a string (title) into a URL-friendly slug.
 * @param title - The string to be converted.
 * @returns A lowercase, hyphenated slug string.
 */
export const convertToSlug = (title: string): string => {
  const baseSlug = generateSlug(title);
  // Generate a short 6-character random string
  const uniqueId = Math.random().toString(36).substring(2, 8);

  return `${baseSlug}-${uniqueId}`;
};
