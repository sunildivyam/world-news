import { notFound } from "next/navigation";

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = params;

  // TODO: Fetch article data based on slug
  // const article = await getArticle(slug);
  // if (!article) notFound();

  return (
    <article className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{slug}</h1>
        <div className="text-gray-600">
          {/* Add article metadata like date, author, etc. */}
        </div>
      </header>

      <main className="prose max-w-none">
        {/* Add article content here */}
        <p>Article content for: {slug}</p>
      </main>
    </article>
  );
}
