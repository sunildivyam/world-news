import { DataNode } from "domhandler";

import { TextNode } from "../../types";
import { cleanText, isWhitespace } from "../utils";

export function visitText(node: DataNode): TextNode | null {
  const text = cleanText(node.data);

  if (isWhitespace(text)) return null;

  return {
    type: "text",

    text,
  };
}
