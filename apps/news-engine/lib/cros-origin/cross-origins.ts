/* eslint-disable @typescript-eslint/no-explicit-any */
import { getLocalHostNames } from "@worldnews/shared/utils";
import { fetchTenants } from "@worldnews/shared/news-engine-apis";
import { NextResponse } from "next/server";

let cachedOrigins: string[] = [];
const localWebPort = "3000";
const localHeadlineEnginePort = "3002";
const localhostsWeb = getLocalHostNames().map(
  (str) => `${str}:${localWebPort}`,
);
const localhostsHeadlineEngine = getLocalHostNames().map(
  (str) => `${str}:${localHeadlineEnginePort}`,
);

async function getAllowedOrigins(): Promise<string[]> {
  if (cachedOrigins?.length) return cachedOrigins;
  cachedOrigins = [...localhostsWeb, ...localhostsHeadlineEngine];
  if (process.env.HEADLINE_ENGINE_BASE) {
    cachedOrigins.push(new URL(process.env.HEADLINE_ENGINE_BASE).host);
  }

  try {
    const tenants = await fetchTenants();
    tenants.forEach((t) => {
      if (t.domain) {
        cachedOrigins.push(t.domain);
      }
    });
    return cachedOrigins.map((url: string) => url?.trim().replace(/\/$/, "")); // Remove trailing slash if present);
  } catch (err: any) {
    return cachedOrigins.map((url: string) => url?.trim().replace(/\/$/, "")); // Remove trailing slash if present);
  }
}

export async function setCorsForAllowedOrigins(
  origin: string,
  response: NextResponse,
) {
  if (!origin) return response;

  const allowedOrigins = await getAllowedOrigins();
  console.log(allowedOrigins);
  if (!allowedOrigins?.length) return response;

  // 1. Check if the origin is in our allowed list or is a local environment
  const originHost = new URL(origin).host;
  const isAllowed = originHost && allowedOrigins.includes(originHost);
  if (!isAllowed) return response;

  // Set CORS headers

  response.headers.set("Access-Control-Allow-Origin", origin);

  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");

  return response;
}
