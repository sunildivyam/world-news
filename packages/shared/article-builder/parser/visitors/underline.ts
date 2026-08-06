import { CheerioAPI } from "cheerio";
import { Element } from "domhandler";

import { InlineNode } from "../../types";
import { visitChildren } from "./visitChildren";

export function parseUnderline($: CheerioAPI, node: Element): InlineNode[] {
  const children = visitChildren($, node) as InlineNode[];

  return children.map(markUnderline);
}

function markUnderline(node: InlineNode): InlineNode {
  switch (node.type) {
    case "text":
      return {
        ...node,
        underline: true,
      };

    case "link":
      return {
        ...node,
        children: node.children.map(markUnderline),
      };

    default:
      return node;
  }
}
