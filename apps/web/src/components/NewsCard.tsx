"use client";

import Image from "next/image";
import NoPrefetchLink from "@/components/NoPrefetchLink";
import ClientDate from "./ClientDate";
import { Article } from "@worldnews/shared/types";
import { resolveUrlFromArticle } from "@/lib/contexts/url/Url.Resolver";
import ArticleSourceLink from "./ArticleSourceLink";
import { AppContext } from "./AppContext.Provider";
import { useContext } from "react";
import { encodeObjectToId } from "@worldnews/shared/utils";
import { StaggerContainer, StaggerItem } from "@worldnews/shared/motion";

interface Props {
  article: Article;
  className?: string;
}

export default function NewsCard({ article, className }: Props) {
  const { userCtx } = useContext(AppContext) || {};
  // Encoding article to id (slug)
  const updatedSlug = encodeObjectToId(article);

  const articleUrl = resolveUrlFromArticle(
    { ...article, slug: updatedSlug },
    userCtx,
  );
  const cNames = `relative${className ? " " + className : ""}`;

  if (!article) return null;

  return (
    <StaggerContainer className={cNames}>
      <NoPrefetchLink href={articleUrl} className="group block pb-6">
        <StaggerItem className="relative w-full h-56 overflow-hidden rounded-lg">
          {article.imageUrl && (
            <Image
              sizes="(max-width: 768px) 100vw, 33vw"
              src={article.imageUrl}
              alt={article.title || article._id || "article"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
        </StaggerItem>

        <StaggerItem
          as="h1"
          className="mt-4 text-xl font-bold group-hover:text-red-600 transition-colors"
        >
          {article.title}
        </StaggerItem>

        <StaggerItem
          as="p"
          className="mt-2 text-gray-600 dark:text-gray-400 line-clamp-2"
        >
          {article.description}
        </StaggerItem>

        <p className="mt-2 text-sm text-gray-500 flex gap-4">
          {article.publishedAt && (
            <ClientDate dateString={article.publishedAt.toString()} />
          )}{" "}
          •{" "}
        </p>
      </NoPrefetchLink>
      <div
        className="block absolute pr-4"
        style={{ bottom: "1.5em", right: "0" }}
      >
        <ArticleSourceLink source={article.source} />
      </div>
    </StaggerContainer>
  );
}
