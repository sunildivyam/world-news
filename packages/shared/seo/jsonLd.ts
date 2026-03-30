export function generateNewsArticleJsonLd(data: {
  url: string;
  title: string;
  description: string;
  image: string;
  publishedAt: string;
  updatedAt: string;
  authorName: string;
  publisherName: string;
  publisherLogo: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": data.url,
    },
    headline: data.title,
    description: data.description,
    image: [data.image],
    datePublished: data.publishedAt,
    dateModified: data.updatedAt,
    author: {
      "@type": "Person",
      name: data.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: data.publisherName,
      logo: {
        "@type": "ImageObject",
        url: data.publisherLogo,
      },
    },
  };
}

export function generateBreadcrumbJsonLd(
  items: {
    name: string;
    url: string;
  }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateWebPageJsonLd(data: {
  url: string;
  name: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: data.url,
    name: data.name,
    description: data.description,
  };
}
