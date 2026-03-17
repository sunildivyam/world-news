"use client";

import { resolveUrlFromArticle } from "@/lib/contexts/url/Url.Resolver";
import { Article } from "@/types/Article.interface";
import Image from "next/image";
import Link from "next/link";
import ArticleSourceLink from "./ArticleSourceLink";

interface Props {
  article: Article;
}

export default function HeroArticle({ article }: Props) {
  return (
    <Link href={resolveUrlFromArticle(article)} className="group block">
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
              <ArticleSourceLink source={article.source} />
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
    </Link>
  );
}
