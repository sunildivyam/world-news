/* eslint-disable @typescript-eslint/no-explicit-any */
import { Language } from "@worldnews/shared";
import {
  createLanguage,
  createLanguages,
  findLanguage,
  findLanguageByCode2,
  findLanguageByName,
  findLanguages,
} from "@worldnews/shared/mongo/collections/languages";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const name = searchParams.get("name");
    const code2 = searchParams.get("code2");

    let result;
    if (code2) {
      result = await findLanguageByCode2(code2.toLowerCase());
    }

    if (code && name) {
      result = await findLanguage(code.toLowerCase(), name);
    } else if (code) {
      result = await findLanguage(code.toLowerCase());
    } else if (name) {
      result = await findLanguageByName(name);
    } else {
      result = await findLanguages();
    }

    return apiSuccess(result);
  } catch (err: any) {
    return apiError(err);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if it's an array for bulk insert
    if (Array.isArray(body)) {
      const result = await createLanguages(body);
      return apiSuccess(result);
    } else {
      // Single language insert
      const result = await createLanguage(body);
      return apiSuccess(result);
    }
  } catch (err: any) {
    return apiError(err);
  }
}
