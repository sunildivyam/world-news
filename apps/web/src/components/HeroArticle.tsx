"use client";

import { resolveUrlFromArticle } from "@/lib/contexts/url/Url.Resolver";
import { Article } from "@worldnews/shared/types";
import Image from "next/image";
import NoPrefetchLink from "@/components/NoPrefetchLink";
import ArticleSourceLink from "./ArticleSourceLink";
import { AppContext } from "./AppContext.Provider";
import { useContext } from "react";

interface Props {
  article: Article;
  className?: string;
}

export default function HeroArticle({ article, className }: Props) {
  const { userCtx } = useContext(AppContext) || {};
  const url = resolveUrlFromArticle(article, userCtx);

  const cNames = `relative w-full h-full overflow-hidden ${className || ""}`;

  if (!article) return null;

  return (
    <article className={cNames}>
      <NoPrefetchLink href={url} className="group block w-full h-full">
        <div className="relative w-full h-full min-h-[50vh]">
          <Image
            sizes="100vw"
            src={article.imageUrl || ""}
            alt={article.title || article._id || "article"}
            fill
            priority
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex items-end">
            <div className="w-full p-4 md:p-8 text-white">
              <div className="max-w-4xl">
                <p className="text-red-500 font-semibold uppercase tracking-wider flex gap-4">
                  Breaking News
                </p>

                <h1 className="mt-3 text-3xl md:text-5xl font-extrabold leading-tight">
                  {article.title}
                </h1>

                {article.description && (
                  <p className="mt-4 text-base md:text-lg text-gray-200 line-clamp-3">
                    {article.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </NoPrefetchLink>

      <div className="absolute bottom-4 right-4 z-10">
        <ArticleSourceLink source={article.source} />
      </div>
    </article>
  );
}
