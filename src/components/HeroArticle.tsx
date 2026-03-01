"use client";

import Image from "next/image";
import { Article } from "@/types/article";
import Link from "next/link";

interface Props {
  article: Article;
}

export default function HeroArticle({ article }: Props) {
  return (
    <Link href={`/article/${article.slug}`} className="group block">
      <div className="relative w-full h-[60vh] overflow-hidden rounded-xl">
        <Image
          sizes="(max-width: 1200px) 100vw, 33vw"
          src={article.imageUrl}
          alt={article.title}
          fill
          priority
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute bottom-0 p-8 text-white max-w-4xl">
          <p className="text-red-500 font-semibold uppercase tracking-wider">
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
    </Link>
  );
}
