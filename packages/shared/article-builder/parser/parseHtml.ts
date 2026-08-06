import { load } from "cheerio";

import { DocumentNode } from "../types";
import { walkDom } from "./walkDom";
import { normalizeDocument } from "./normalize";

export function parseHtml(html: string): DocumentNode {
  if (!html?.trim()) {
    return {
      type: "document",
      children: [],
    };
  }

  const $ = load(html);

  const document = walkDom($, $.root());

  return normalizeDocument(document);
}
