import { CheerioAPI, } from "cheerio";
import { Element } from "domhandler";

import { HeadingNode, InlineNode } from "../../types";
import { visitChildren } from "./visitChildren";

export function parseHeading($: CheerioAPI, node: Element): HeadingNode {
  const level = Number(node.tagName.substring(1)) as 1 | 2 | 3 | 4 | 5 | 6;

  return {
    type: "heading",
    level,
    children: visitChildren($, node) as InlineNode[],
  };
}
