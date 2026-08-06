import { CheerioAPI } from "cheerio";
import { Element } from "domhandler";

import { parseHeading } from "./heading";
import { parseParagraph } from "./paragraph";
import { parseLink } from "./link";
import { parseImage } from "./image";
import { parseList } from "./list";
import { parseBlockquote } from "./blockquote";
import { parseDivider } from "./divider";
import { parseTable } from "./table";
import { visitChildren } from "./visitChildren";
import { parseStrong } from "./strong";
import { parseEm } from "./em";
import { parseUnderline } from "./underline";
import { parseCode } from "./code";
import { parseSup } from "./sup";
import { parseSub } from "./sub";
import { parseBr } from "./br";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function visitElement($: CheerioAPI, node: Element): any {
  const tag = node.tagName.toLowerCase();

  switch (tag) {
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      return parseHeading($, node);

    case "p":
      return parseParagraph($, node);

    case "a":
      return parseLink($, node);

    case "img":
      return parseImage($, node);

    case "ul":
    case "ol":
      return parseList($, node);

    case "blockquote":
      return parseBlockquote($, node);

    case "hr":
      return parseDivider();

    case "table":
      return parseTable($, node);
    case "strong":
    case "b":
      return parseStrong($, node);
    case "em":
    case "i":
      return parseEm($, node);
    case "u":
      return parseUnderline($, node);
    case "code":
      return parseCode($, node);
    case "sup":
      return parseSup($, node);
    case "sub":
      return parseSub($, node);
    case "br":
      return parseBr();
    /**
     * Ignore layout elements.
     * Just recurse into their children.
     */
    case "html":
    case "body":
    case "main":
    case "article":
    case "section":
    case "div":
    case "span":
    case "header":
    case "footer":
    case "aside":
    case "figure":
    case "figcaption":
    case "nav":
      return visitChildren($, node);

    default:
      return visitChildren($, node);
  }
}
