import { CheerioAPI } from "cheerio";
import { Element } from "domhandler";

import { ImageNode } from "../../types";

export function parseImage($: CheerioAPI, node: Element): ImageNode | null {
  const src = node.attribs?.src?.trim();

  if (!src) {
    return null;
  }

  return {
    type: "image",
    src,
    alt: node.attribs?.alt,
    title: node.attribs?.title,
    width: node.attribs?.width ? Number(node.attribs.width) : undefined,
    height: node.attribs?.height ? Number(node.attribs.height) : undefined,
  };
}
