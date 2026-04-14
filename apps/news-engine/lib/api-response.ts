/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError } from "@worldnews/shared/types/AppError.class";

export function apiSuccess<T>(data: T) {
  return Response.json(data);
}

export function apiError(error: any) {
  const isDev = process.env.NODE_ENV === "development";
  const e: AppError = error;

  return Response.json(
    {
      success: false,
      source: isDev ? e.source : undefined,
      details: isDev ? e.details : undefined,
      error: e.message,
    },
    { status: e.status },
  );
}
