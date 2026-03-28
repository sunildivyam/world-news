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
import { error } from "@worldnews/shared/mongo/response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const name = searchParams.get("name");
    const code2 = searchParams.get("code2");

    if (code2) {
      return await findLanguageByCode2(code2.toLowerCase());
    }

    if (code && name) {
      return await findLanguage(code.toLowerCase(), name);
    } else if (code) {
      return await findLanguage(code.toLowerCase());
    } else if (name) {
      return await findLanguageByName(name);
    } else {
      return await findLanguages();
    }
  } catch (e: any) {
    return error(e?.message || e, 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if it's an array for bulk insert
    if (Array.isArray(body)) {
      const result = await createLanguages(body);
      return result;
    } else {
      // Single language insert
      const result = await createLanguage(body);
      return result;
    }
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}
