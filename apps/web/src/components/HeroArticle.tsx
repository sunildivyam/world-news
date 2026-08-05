"use client";

import { resolveUrlFromArticle } from "@/lib/contexts/url/Url.Resolver";
import { Article } from "@worldnews/shared/types";
import Image from "next/image";
import NoPrefetchLink from "@/components/NoPrefetchLink";
import ArticleSourceLink from "./ArticleSourceLink";
import { AppContext } from "./AppContext.Provider";
import { useContext } from "react";
import { encodeObjectToId } from "@worldnews/shared/utils";
import { StaggerContainer, StaggerItem } from "@worldnews/shared/motion";

interface Props {
  article: Article;
  className?: string;
}

export default function HeroArticle({ article, className }: Props) {
  const { userCtx } = useContext(AppContext) || {};
  // Encoding article to id (slug)
  const updatedSlug = encodeObjectToId(article);

  const url = resolveUrlFromArticle({ ...article, slug: updatedSlug }, userCtx);

  const cNames = `relative w-full h-full overflow-hidden ${className || ""}`;

  if (!article) return null;

  return (
    <StaggerContainer as="article" className={cNames}>
      <NoPrefetchLink href={url} className="group block w-full h-full">
        <div className="relative w-full h-[80vh] min-h-min overflow-hidden">
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
                <StaggerItem
                  as="p"
                  className="text-red-500 font-semibold uppercase tracking-wider flex gap-4"
                >
                  Breaking News
                </StaggerItem>

                <StaggerItem
                  as="h1"
                  className="mt-3 text-3xl md:text-5xl font-extrabold leading-tight"
                >
                  {article.title}
                </StaggerItem>

                {article.description && (
                  <StaggerItem
                    as="p"
                    className="mt-4 text-base md:text-lg text-gray-200 line-clamp-3"
                  >
                    {article.description}
                  </StaggerItem>
                )}
              </div>
            </div>
          </div>
        </div>
      </NoPrefetchLink>

      <div className="absolute bottom-4 right-4 z-10">
        <ArticleSourceLink source={article.source} />
      </div>
    </StaggerContainer>
  );
}
