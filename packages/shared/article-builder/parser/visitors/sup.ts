import { CheerioAPI } from "cheerio";
import type { Element } from "domhandler";

import { InlineNode } from "../../types";
import { visitChildren } from "./visitChildren";

export function parseSup($: CheerioAPI, node: Element): InlineNode[] {
  const children = visitChildren($, node) as InlineNode[];

  return children.map(markSuperscript);
}

function markSuperscript(node: InlineNode): InlineNode {
  switch (node.type) {
    case "text":
      return {
        ...node,
        superscript: true,
      };

    case "link":
      return {
        ...node,
        children: node.children.map(markSuperscript),
      };

    default:
      return node;
  }
}
