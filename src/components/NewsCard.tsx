"use client";

import Image from "next/image";
import Link from "next/link";
import ClientDate from "./ClientDate";
import { Article } from "@/types/Article.interface";
import { resolveUrlFromArticle } from "@/lib/contexts/url/Url.Resolver";
import ArticleSourceLink from "./ArticleSourceLink";
import { AppContext } from "./AppContext.Provider";
import { useContext } from "react";

interface Props {
  article: Article;
}

export default function NewsCard({ article }: Props) {
  const { userCtx } = useContext(AppContext) || {};
  const articleUrl = resolveUrlFromArticle(article, userCtx);

  return (
    <div className="relative">
      <Link href={articleUrl} className="group block pb-6">
        <div className="relative w-full h-56 overflow-hidden rounded-lg">
          <Image
            sizes="(max-width: 768px) 100vw, 33vw"
            src={article.imageUrl || ""}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <h3 className="mt-4 text-xl font-bold group-hover:text-red-600 transition-colors">
          {article.title}
        </h3>

        <p className="mt-2 text-gray-600 dark:text-gray-400 line-clamp-2">
          {article.description}
        </p>

        <p className="mt-2 text-sm text-gray-500 flex gap-4">
          <ClientDate dateString={article.publishDate.toString()} /> •{" "}
        </p>
      </Link>
      <div
        className="block absolute pr-4"
        style={{ bottom: "1.5em", right: "0" }}
      >
        <ArticleSourceLink source={article.source} />
      </div>
    </div>
  );
}
