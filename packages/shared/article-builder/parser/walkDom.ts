import { Cheerio, CheerioAPI } from "cheerio";
import { Element, AnyNode } from "domhandler";

import { DocumentNode, BlockNode } from "../types";
import { visitElement, visitText } from "./visitors";

export function walkDom($: CheerioAPI, root: Cheerio<AnyNode>): DocumentNode {
  const children: BlockNode[] = [];

  root.contents().each((_, node) => {
    const ast = visitNode($, node);

    if (!ast) return;

    if (Array.isArray(ast)) children.push(...ast);
    else children.push(ast);
  });

  return {
    type: "document",
    children,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function visitNode($: CheerioAPI, node: AnyNode): any {
  switch (node.type) {
    case "text":
      return visitText(node);

    case "tag":
      return visitElement($, node as Element);

    default:
      return null;
  }
}
