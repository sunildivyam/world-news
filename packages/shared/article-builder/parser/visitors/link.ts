import { CheerioAPI } from "cheerio";
import { Element } from "domhandler";

import { LinkNode, InlineNode } from "../../types";
import { visitChildren } from "./visitChildren";

export function parseLink($: CheerioAPI, node: Element): LinkNode {
  return {
    type: "link",
    href: node.attribs?.href ?? "",
    children: visitChildren($, node) as InlineNode[],
  };
}
