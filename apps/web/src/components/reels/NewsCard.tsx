"use client";

import Image from "next/image";
import NoPrefetchLink from "@/components/NoPrefetchLink";
import { Article } from "@worldnews/shared/types";
import { resolveUrlFromArticle } from "@/lib/contexts/url/Url.Resolver";
import { useContext } from "react";
import { encodeObjectToId } from "@worldnews/shared/utils";
import { StaggerContainer, StaggerItem } from "@worldnews/shared/motion";
import { AppContext } from "../AppContext.Provider";
import ClientDate from "../ClientDate";
import ArticleSourceLink from "../ArticleSourceLink";

interface Props {
  article: Article;
  className?: string;
  priority?: boolean;
}

export default function NewsCard({ article, className, priority = false }: Props) {
  const { userCtx } = useContext(AppContext) || {};

  if (!article) {
    return null;
  }

  const updatedSlug = encodeObjectToId(article);

  const articleUrl = resolveUrlFromArticle({ ...article, slug: updatedSlug }, userCtx);

  const cNames = ["relative", "h-full", "w-full", "overflow-hidden", "bg-background", className].filter(Boolean).join(" ");

  const imageAlt = article.title || article._id || "News article";

  return (
    <StaggerContainer className={cNames}>
      <div className="group relative block h-full w-full overflow-hidden">
        {/* Background image */}
        <div className="bg-muted absolute inset-0 overflow-hidden">{article.imageUrl ? <Image src={article.imageUrl} alt={imageAlt} fill priority={priority} sizes="100vw" className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]" /> : <div className="from-muted to-background absolute inset-0 bg-gradient-to-br" />}</div>

        {/* Overall image treatment */}
        <div className="pointer-events-none absolute inset-0 bg-black/10" />

        {/* Bottom readability gradient */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[75%] bg-gradient-to-t from-black/90 via-black/55 to-transparent" />

        {/* Subtle top gradient */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/45 to-transparent" />

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-7 md:p-9 lg:p-12">
          <div className="mx-auto w-full max-w-5xl">
            {/* Metadata */}
            <StaggerItem className="mb-3 flex items-center gap-2 text-xs font-medium text-white/75 sm:text-sm">
              {article.source && <span className="max-w-[12rem] truncate rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-md">{typeof article.source === "string" ? article.source : article.source.name}</span>}

              {article.publishedAt && (
                <>
                  <span className="text-white/50">•</span>

                  <span>
                    <ClientDate dateString={article.publishedAt.toString()} />
                  </span>
                </>
              )}
            </StaggerItem>

            {/* Headline */}
            <StaggerItem as="h1" className="max-w-4xl text-2xl leading-[1.08] font-bold tracking-tight text-white drop-shadow-sm sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
              {article.title}
            </StaggerItem>

            {/* Description */}
            {article.description && (
              <StaggerItem as="p" className="mt-3 line-clamp-3 max-w-3xl text-sm leading-relaxed text-white/80 sm:mt-4 sm:text-base md:text-lg">
                {article.description}
              </StaggerItem>
            )}

            {/* Read indicator */}
            <StaggerItem className="mt-5 flex items-center gap-3 sm:mt-6">
              <NoPrefetchLink href={articleUrl}>
                <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md transition-colors group-hover:bg-white/20 sm:text-sm">
                  Read full story
                  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </NoPrefetchLink>
            </StaggerItem>
          </div>
        </div>

        {/* Source link */}
        {article.source && (
          <div className="absolute right-5 bottom-5 z-20 sm:right-7 sm:bottom-7 md:right-9 md:bottom-9">
            <div className="rounded-full border border-white/15 bg-black/30 p-1.5 shadow-lg backdrop-blur-md">
              <ArticleSourceLink source={article.source} />
            </div>
          </div>
        )}
      </div>
    </StaggerContainer>
  );
}
