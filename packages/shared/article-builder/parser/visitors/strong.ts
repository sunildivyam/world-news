import { CheerioAPI } from "cheerio";
import { Element } from "domhandler";

import { InlineNode } from "../../types";
import { visitChildren } from "./visitChildren";

export function parseStrong($: CheerioAPI, node: Element): InlineNode[] {
  const children = visitChildren($, node) as InlineNode[];

  return children.map(markBold);
}

function markBold(node: InlineNode): InlineNode {
  switch (node.type) {
    case "text":
      return {
        ...node,
        bold: true,
      };

    case "link":
      return {
        ...node,
        children: node.children.map(markBold),
      };

    default:
      return node;
  }
}
