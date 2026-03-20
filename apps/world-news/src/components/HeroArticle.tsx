"use client";

import { resolveUrlFromArticle } from "@/lib/contexts/url/Url.Resolver";
import { Article } from "@worldnews/shared";
import Image from "next/image";
import NoPrefetchLink from "@/components/NoPrefetchLink";
import ArticleSourceLink from "./ArticleSourceLink";
import { AppContext } from "./AppContext.Provider";
import { useContext } from "react";

interface Props {
  article: Article;
}

export default function HeroArticle({ article }: Props) {
  const { userCtx } = useContext(AppContext) || {};
  const url = resolveUrlFromArticle(article, userCtx);

  return (
    <div className="block">
      <NoPrefetchLink href={url} className="group block">
        <div className="relative w-full h-[70vh] overflow-hidden">
          <Image
            sizes="(max-width: 1200px) 100vw, 50vw"
            src={article.imageUrl || ""}
            alt={article.title}
            fill
            priority
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="absolute bottom-0 p-8 text-white max-w-4xl">
              <p className="text-red-500 font-semibold uppercase tracking-wider flex gap-4">
                Breaking News
              </p>

              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mt-3">
                {article.title}
              </h1>

              <p className="mt-4 text-lg text-gray-200 line-clamp-3">
                {article.description}
              </p>
            </div>
          </div>
        </div>
      </NoPrefetchLink>
      <div
        className="block absolute pr-4"
        style={{ bottom: "1.5em", right: "0" }}
      >
        <ArticleSourceLink source={article.source} />
      </div>
    </div>
  );
}
