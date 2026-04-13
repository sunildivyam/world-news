import { Article } from "@worldnews/shared/types";
import NewsCard from "./NewsCard";

interface Props {
  articles: Article[];
  className?: string;
}

export default function NewsGrid({ articles, className }: Props) {
  const cNames = `grid gap-8 mt-12${className ? " " + className : ""}`;
  return (
    <div className={cNames}>
      {articles.map((article, index) => (
        <NewsCard
          key={article._id || article.slug || article.title + index}
          article={article}
        />
      ))}
    </div>
  );
}
