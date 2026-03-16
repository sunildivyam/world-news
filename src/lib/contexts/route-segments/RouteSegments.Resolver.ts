import { PageTypeEnum } from "@/types/PageType.enum";
import { RouteSegmentContext } from "./RouteSegmentsContext.interface";
import { isLanguage } from "../language/Language.Service";
import { isCity, isCountry, isRegion } from "../geo/Geo.helper";
import { NextRequest } from "next/server";
import { staticPages } from "@/app-constants/staticPages.constant";

const pageTypes = Object.keys(PageTypeEnum);

export async function resolveRouteSegmentsContext(
  request: NextRequest | string[],
): Promise<RouteSegmentContext> {
  let segments;
  if (!Array.isArray(request)) {
    const pathname = request.nextUrl.pathname;
    segments = pathname.split("/").filter(Boolean);
  } else {
    segments = request;
  }

  const ctx: RouteSegmentContext = {
    tenantId: undefined,
    country: undefined,
    region: undefined,
    city: undefined,
    language: undefined,
    pageType: undefined,
    pageId: undefined,
  };

  let i = 0; // skip tenant

  while (i < segments.length) {
    const seg = segments[i];

    if (!ctx.country && isCountry(seg)) {
      ctx.country = seg;
      i++;
      continue;
    }

    if (!ctx.region && isRegion(ctx.country || "", seg)) {
      ctx.region = seg;
      i++;
      continue;
    }

    if (!ctx.city && isCity(ctx.country || "", ctx.region || "", seg)) {
      ctx.city = seg;
      i++;
      continue;
    }

    if (!ctx.language && isLanguage(ctx.country || "", seg)) {
      ctx.language = seg;
      i++;
      continue;
    }

    if (pageTypes.includes(seg)) {
      ctx.pageType = seg as PageTypeEnum;
      ctx.pageId = segments[i + 1];
      break;
    }

    if (staticPages.includes(seg)) {
      ctx.pageType = undefined;
      ctx.pageId = seg;
      break;
    }

    i++;
  }

  return ctx;
}
