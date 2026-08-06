interface RenderRawHtmlProps {
  html: string;
}

export default async function RenderRawHtml({ html }: RenderRawHtmlProps) {
  if (!html) return null;

  return (
    <div
      className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
