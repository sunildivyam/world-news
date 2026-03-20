import { Article } from "@worldnews/shared";
import NewsCard from "./NewsCard";

interface Props {
  articles: Article[];
  mdCols?: number;
  lgCols?: number;
}

export default function NewsGrid({ articles, mdCols, lgCols }: Props) {
  return (
    <div
      className={`grid gap-8 mt-12 md:grid-cols-${mdCols || "2"} lg:grid-cols-${lgCols || "3"}`}
    >
      {articles.map((article) => (
        <NewsCard
          key={article.id || article.slug || article.title}
          article={article}
        />
      ))}
    </div>
  );
}
