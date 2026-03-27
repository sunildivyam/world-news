import { PageTypeEnum, RouteSegmentContext } from "@worldnews/shared/types";
import { NextRequest } from "next/server";
import { staticPages } from "@/app-constants/staticPages.constant";
import { geoService } from "@worldnews/shared/server";

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
  let countryExist;
  let regionExist;
  let cityExist;
  let languageExist;

  while (i < segments.length) {
    const seg = segments[i];

    if (!ctx.country) {
      countryExist = await geoService.isCountryExist(seg);
      if (countryExist) {
        ctx.country = seg;
        i++;
        continue;
      }
    }

    if (!ctx.region) {
      regionExist =
        countryExist && (await geoService.isRegionExist(countryExist, seg));
      if (regionExist) {
        ctx.region = seg;
        i++;
        continue;
      }
    }

    if (!ctx.city) {
      cityExist =
        regionExist && (await geoService.isCityExist(regionExist, seg));
      if (cityExist) {
        ctx.city = seg;
        i++;
        continue;
      }
    }

    if (!ctx.language) {
      languageExist = await geoService.isLanguageExist(
        seg,
        countryExist || undefined,
        regionExist || undefined,
        cityExist || undefined,
      );
      if (languageExist) {
        ctx.language = seg;
        i++;
        continue;
      }
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
