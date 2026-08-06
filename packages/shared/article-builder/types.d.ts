// components/article/types.ts

export interface DocumentNode {
  type: "document";
  children: ArticleNode[];
}

export type ArticleNode =
  | HeadingNode
  | ParagraphNode
  | TextNode
  | ImageNode
  | ListNode
  | ListItemNode
  | LinkNode
  | QuoteNode
  | CodeBlockNode
  | DividerNode
  | TableNode
  | TableRowNode
  | TableCellNode
  | FigureNode
  | CalloutNode;

export interface BaseNode {
  id?: string;
}

export interface TextNode extends BaseNode {
  type: "text";

  text: string;

  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  code?: boolean;
  subscript?: boolean;
  superscript?: boolean;
}

export interface ParagraphNode extends BaseNode {
  type: "paragraph";

  children: InlineNode[];
}

export interface HeadingNode extends BaseNode {
  type: "heading";

  level: 1 | 2 | 3 | 4 | 5 | 6;

  children: InlineNode[];
}

export interface LinkNode extends BaseNode {
  type: "link";

  href: string;

  children: InlineNode[];
}

export interface ImageNode extends BaseNode {
  type: "image";

  src: string;

  alt?: string;

  title?: string;

  width?: number;

  height?: number;
}

export interface FigureNode extends BaseNode {
  type: "figure";

  image: ImageNode;

  caption?: ParagraphNode;
}

export interface QuoteNode extends BaseNode {
  type: "quote";

  children: BlockNode[];
}

export interface DividerNode extends BaseNode {
  type: "divider";
}

export interface CodeBlockNode extends BaseNode {
  type: "code";

  language?: string;

  code: string;
}

export interface ListNode extends BaseNode {
  type: "list";

  ordered: boolean;

  children: ListItemNode[];
}

export interface ListItemNode extends BaseNode {
  type: "list-item";

  children: BlockNode[];
}

export interface TableNode extends BaseNode {
  type: "table";

  children: TableRowNode[];
}

export interface TableRowNode extends BaseNode {
  type: "table-row";

  children: TableCellNode[];
}

export interface TableCellNode extends BaseNode {
  type: "table-cell";

  header?: boolean;

  children: BlockNode[];
}

export interface CalloutNode extends BaseNode {
  type: "callout";

  variant?: "info" | "warning" | "success" | "danger";

  children: BlockNode[];
}

/**
 * Convenience unions
 */

export type InlineNode = TextNode | LinkNode | ImageNode;

export type BlockNode =
  | ParagraphNode
  | HeadingNode
  | QuoteNode
  | FigureNode
  | ListNode
  | DividerNode
  | CodeBlockNode
  | TableNode
  | CalloutNode;

export interface DocumentNode {
  type: "document";
  children: ArticleNode[];

  metadata?: {
    title?: string;
    author?: string;
    publishedAt?: string;
    source?: string;
    featuredImage?: string;
  };
}
