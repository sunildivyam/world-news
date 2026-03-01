"use client";

import Image from "next/image";
import Link from "next/link";
import { Article } from "@/types/article";
import ClientDate from "./ClientDate";

interface Props {
  article: Article;
}

export default function NewsCard({ article }: Props) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="group block border-b pb-6"
    >
      <div className="relative w-full h-56 overflow-hidden rounded-lg">
        <Image
          sizes="(max-width: 768px) 100vw, 33vw"
          src={article.imageUrl}
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

      <p className="mt-2 text-sm text-gray-500">
        <ClientDate dateString={article.publishedAt} /> • {article.publishedBy}
      </p>
    </Link>
  );
}
