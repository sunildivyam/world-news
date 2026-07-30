import parse, {
  HTMLReactParserOptions,
  Element,
  domToReact,
} from "html-react-parser";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { readNbuildExternalArticle } from "@worldnews/shared/server";

interface ArticleBodyRawProps {
  url: string;
  toComponents?: boolean;
}

export default async function ArticleBodyRaw({
  url,
  toComponents = false,
}: ArticleBodyRawProps) {
  if (!url) return null;
  let error: any;
  let htmlContent: string | null = null;

  try {
    const externalArticleRes = await readNbuildExternalArticle(url);
    htmlContent = externalArticleRes.data.content;
  } catch (err) {
    error = err;
  }
  // Read article from external source

  if (!htmlContent) return null;

  if (error) {
    return (
      <div className="p-6 text-red-600 bg-red-50 rounded-lg border border-red-200">
        <p className="font-semibold">Error Loading Article</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!toComponents) {
    return (
      <div
        className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  }

  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (!(domNode instanceof Element)) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const children = domToReact(domNode.children as any, options);

      // --- Headings ---
      if (domNode.name === "h1") {
        return (
          <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl mt-8 mb-4 text-foreground">
            {children}
          </h1>
        );
      }

      // FIX 1: Use an inline container or fragment inside h2 instead of wrapping h2 inside a <div>
      if (domNode.name === "h2") {
        return (
          <span className="block mt-8 mb-4">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight text-foreground">
              {children}
            </h2>
            <Separator className="mt-2" />
          </span>
        );
      }

      if (domNode.name === "h3") {
        return (
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight mt-6 mb-3 text-foreground">
            {children}
          </h3>
        );
      }

      // --- Paragraphs & Blockquotes ---
      // FIX 2: Render <p> tags as a <div> with paragraph styling.
      // Web articles frequently nest block elements like <img>, <figure>, or <div> inside <p> tags.
      if (domNode.name === "p") {
        return (
          <div className="leading-8 [&:not(:first-child)]:mt-4 text-gray-700 dark:text-gray-300 text-xl my-4">
            {children}
          </div>
        );
      }

      if (domNode.name === "blockquote") {
        return (
          <blockquote className="mt-6 border-l-4 border-primary pl-4 italic text-muted-foreground bg-muted/30 py-2 rounded-r-md">
            {children}
          </blockquote>
        );
      }

      // --- Lists ---
      if (domNode.name === "ul") {
        return <ul className="my-4 ml-6 list-disc [&>li]:mt-2">{children}</ul>;
      }

      if (domNode.name === "ol") {
        return (
          <ol className="my-4 ml-6 list-decimal [&>li]:mt-2">{children}</ol>
        );
      }

      // --- Links & Inline Code ---
      if (domNode.name === "a") {
        const href = domNode.attribs.href || "#";
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
          >
            {children}
          </a>
        );
      }

      if (domNode.name === "code") {
        return (
          <Badge
            variant="outline"
            className="font-mono text-xs px-1.5 py-0.5 font-normal"
          >
            {children}
          </Badge>
        );
      }

      // --- Images wrapped in Shadcn Cards ---
      // FIX 3: Render image container as a <div> to avoid nesting <figure> inside <p>
      if (domNode.name === "img") {
        const { src, alt, title } = domNode.attribs;
        return (
          <div className="my-6">
            <Card className="overflow-hidden border-muted">
              <img
                width={600}
                height={600}
                src={src}
                alt={alt || "Article image"}
                className="w-full h-auto object-cover max-h-[500px]"
                loading="lazy"
              />
              {(alt || title) && (
                <CardContent className="p-3 text-xs text-center text-muted-foreground bg-muted/20">
                  {title || alt}
                </CardContent>
              )}
            </Card>
          </div>
        );
      }

      // --- Tables mapped to Shadcn Table Primitives ---
      if (domNode.name === "table") {
        return (
          <div className="my-6 w-full overflow-y-auto rounded-md border">
            <Table>{children}</Table>
          </div>
        );
      }

      if (domNode.name === "thead")
        return <TableHeader>{children}</TableHeader>;
      if (domNode.name === "tbody") return <TableBody>{children}</TableBody>;
      if (domNode.name === "tr") return <TableRow>{children}</TableRow>;
      if (domNode.name === "th") return <TableHead>{children}</TableHead>;
      if (domNode.name === "td") return <TableCell>{children}</TableCell>;
      if (domNode.name === "hr") return <Separator className="my-8" />;
    },
  };

  const component = parse(htmlContent, options);

  return <>{component}</>;
}
