import { getCollections } from "../collections";

export async function getHeadlines({
  category,
  region,
  limit,
  skip,
}: {
  category?: string;
  region?: string;
  limit: number;
  skip: number;
}) {
  const { headlines } = await getCollections();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: any = {};

  if (category) query.category = category;
  if (region) query.region = region;

  return headlines
    .find(query)
    .sort({ priority: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();
}
