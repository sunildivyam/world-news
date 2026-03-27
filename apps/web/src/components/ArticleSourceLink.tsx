"use client";

import { ArticleSource } from "@worldnews/shared/types";
import Image from "next/image";
import NoPrefetchLink from "@/components/NoPrefetchLink";

interface ArticleSourceLinkProps {
  source?: ArticleSource;
}

export default function ArticleSourceLink({ source }: ArticleSourceLinkProps) {
  if (!source) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (source.url) {
      window.open(source.url, "_blank");
    }
  };

  return (
    <NoPrefetchLink
      onClick={handleClick}
      href={source.url || ""}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
    >
      {source.iconUrl && (
        <Image
          src={source.iconUrl}
          alt={source.name}
          width={20}
          height={20}
          className="rounded"
        />
      )}
      <span>{source.name}</span>
    </NoPrefetchLink>
  );
}
