import { CheerioAPI } from "cheerio";
import { Element } from "domhandler";

import { ParagraphNode, InlineNode } from "../../types";
import { visitChildren } from "./visitChildren";

export function parseParagraph($: CheerioAPI, node: Element): ParagraphNode {
  return {
    type: "paragraph",
    children: visitChildren($, node) as InlineNode[],
  };
}
