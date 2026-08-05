import { Article } from "../types/Article.interface";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";

/**
 * Encodes a standard web URL into a URL-safe Base64 string for use as a route parameter [id].
 */
export function encodeUrlToId(url: string): string {
  if (!url) return "";
  try {
    // 1. Encode UTF-8 characters cleanly
    const encoded = encodeURIComponent(url);
    // 2. Convert to standard Base64
    const base64 =
      typeof window !== "undefined"
        ? btoa(encoded)
        : Buffer.from(encoded).toString("base64");
    // 3. Make Base64 URL-safe (replace +, /, and remove = padding)
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  } catch (error) {
    console.error("Failed to encode URL:", error);
    return "";
  }
}

/**
 * Decodes a URL-safe Base64 string [id] back into the original web URL.
 */
export function decodeIdToUrl(id: string): string {
  if (!id) return "";
  try {
    // 1. Restore standard Base64 string characters
    let base64 = id.replace(/-/g, "+").replace(/_/g, "/");
    // 2. Pad missing '=' characters for valid Base64 decoding
    while (base64.length % 4) {
      base64 += "=";
    }
    // 3. Convert Base64 back to encoded string
    const decoded =
      typeof window !== "undefined"
        ? atob(base64)
        : Buffer.from(base64, "base64").toString("utf-8");
    // 4. Decode URI components back to original URL
    return decodeURIComponent(decoded);
  } catch (error) {
    console.error("Failed to decode ID to URL:", error);
    return "";
  }
}

/**
 * Encodes an object into a URL-safe Base64 ID string.
 */
export function encodeObjectToId(data: Article): string {
  if (!data) return "";
  try {
    const article = JSON.stringify(data);
    return compressToEncodedURIComponent(article);
  } catch (error) {
    console.error("Failed to encode object to ID:", error);
    return "";
  }
}

/**
 * Decodes a URL-safe Base64 ID string back into the original object.
 */
export function decodeIdToObject<T = Article>(id: string): T | null {
  if (!id) return null;
  try {
    const json = decompressFromEncodedURIComponent(id);
    if (!json) {
      throw new Error("Invalid article id");
    }

    return JSON.parse(json);
  } catch (error) {
    console.error("Failed to decode ID to object:", error);
    return null;
  }
}
