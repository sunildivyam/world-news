import { Article } from "@/types/article";
import NewsCard from "./NewsCard";

interface Props {
  articles: Article[];
}

export default function NewsGrid({ articles }: Props) {
  return (
    <div className="grid gap-8 mt-12 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>
  );
}
