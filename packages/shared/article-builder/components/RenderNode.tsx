import { JSX } from "react/jsx-runtime";
import {
  ArticleNode,
  BlockNode,
  InlineNode,
  TextNode,
  HeadingNode,
  ParagraphNode,
  LinkNode,
  ImageNode,
  ListNode,
  QuoteNode,
  TableNode,
  FigureNode,
  CalloutNode,
} from "../types";

interface RenderNodeProps {
  node: ArticleNode | BlockNode | InlineNode;
}

export function RenderNode({ node }: RenderNodeProps) {
  switch (node.type) {
    case "heading":
      return renderHeading(node);

    case "paragraph":
      return renderParagraph(node);

    case "text":
      return renderText(node);

    case "link":
      return renderLink(node);

    case "image":
      return renderImage(node);

    case "list":
      return renderList(node);

    case "quote":
      return renderQuote(node);

    case "divider":
      return <div className="my-8 divide-y divide-gray-200" />;

    case "table":
      return renderTable(node);

    case "figure":
      return renderFigure(node);

    case "callout":
      return renderCallout(node);

    default:
      return null;
  }
}

function renderHeading(node: HeadingNode) {
  const className = {
    1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl my-6",
    2: "scroll-m-20 text-3xl font-semibold tracking-tight mt-10 mb-4",
    3: "scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3",
    4: "scroll-m-20 text-xl font-semibold tracking-tight mt-6 mb-2",
    5: "text-lg font-semibold mt-5 mb-2",
    6: "text-base font-semibold mt-4 mb-2",
  }[node.level];

  const Tag = `h${node.level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag className={className}>
      {node.children.map((child, i) => (
        <RenderNode key={i} node={child} />
      ))}
    </Tag>
  );
}

function renderParagraph(node: ParagraphNode) {
  return (
    <p className="leading-8 text-muted-foreground mb-5">
      {node.children.map((child, i) => (
        <RenderNode key={i} node={child} />
      ))}
    </p>
  );
}

function renderText(node: TextNode) {
  let content: React.ReactNode = node.text;

  if (node.code) content = <code>{content}</code>;
  if (node.bold) content = <strong>{content}</strong>;
  if (node.italic) content = <em>{content}</em>;
  if (node.underline) content = <u>{content}</u>;
  if (node.strike) content = <del>{content}</del>;
  if (node.subscript) content = <sub>{content}</sub>;
  if (node.superscript) content = <sup>{content}</sup>;

  return <>{content}</>;
}

function renderLink(node: LinkNode) {
  return (
    <a
      href={node.href}
      target="_blank"
      rel="noopener noreferrer"
      className="mx-1 text-primary underline underline-offset-4 hover:no-underline"
    >
      {node.children.map((child, i) => (
        <RenderNode key={i} node={child} />
      ))}
    </a>
  );
}

function renderImage(node: ImageNode) {
  return (
    <img src={node.src} alt={node.alt} className="rounded-lg my-6 w-full" />
  );
}

function renderList(node: ListNode) {
  const Tag = node.ordered ? "ol" : "ul";

  return (
    <Tag className="my-4 ml-6 list-disc space-y-2">
      {node.children.map((item, i) => (
        <li key={i}>
          {item.children.map((child, j) => (
            <RenderNode key={j} node={child} />
          ))}
        </li>
      ))}
    </Tag>
  );
}

function renderQuote(node: QuoteNode) {
  return (
    <blockquote className="border-l-4 pl-6 italic my-6">
      {node.children.map((child, i) => (
        <RenderNode key={i} node={child} />
      ))}
    </blockquote>
  );
}

function renderTable(node: TableNode) {
  return (
    <div className="overflow-auto my-6">
      <table className="w-full border-collapse border">
        <tbody>
          {node.children.map((row, i) => (
            <tr key={i}>
              {row.children.map((cell, j) => {
                const Cell = cell.header ? "th" : "td";

                return (
                  <Cell key={j} className="border p-3">
                    {cell.children.map((child, k) => (
                      <RenderNode key={k} node={child} />
                    ))}
                  </Cell>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderFigure(node: FigureNode) {
  return (
    <figure className="my-8">
      <RenderNode node={node.image} />

      {node.caption && (
        <figcaption className="text-center text-sm text-muted-foreground mt-2">
          <RenderNode node={node.caption} />
        </figcaption>
      )}
    </figure>
  );
}

function renderCallout(node: CalloutNode) {
  return (
    <div className="rounded-lg border bg-muted p-4 my-6">
      {node.children.map((child, i) => (
        <RenderNode key={i} node={child} />
      ))}
    </div>
  );
}
