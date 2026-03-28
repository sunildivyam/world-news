/* eslint-disable @typescript-eslint/no-explicit-any */
import { Language } from "../../types/Language.interface";
import { getCollections } from "../collections";
import { randomBytes } from "crypto";
import { InsertOneResult, UpdateResult } from "mongodb";
import { error, success } from "../response";

export function generateLanguage(): string {
  return randomBytes(32).toString("hex");
}

export async function createLanguage(language: Language) {
  if (!language?.code) return error("Empty Language can not be created.");

  try {
    const { languages } = await getCollections();

    const result: InsertOneResult = await languages.insertOne(language);

    if (!result.insertedId) {
      return error("Failed to create Language");
    }

    return success({ ...language, id: result.insertedId });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function updateLanguage(code: string, updates: Partial<Language>) {
  if (!code) return error("Empty Language, can not be updated.");
  try {
    const { languages } = await getCollections();
    const result: UpdateResult = await languages.updateOne(
      { code },
      { $set: updates },
    );

    if (result.modifiedCount === 0) {
      return error("Failed to update Language", 500);
    }

    return success({ code });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function deleteLanguage(code: string) {
  if (!code) return error("Empty Language, can not be deleted.");
  try {
    const { languages } = await getCollections();
    const result = await languages.deleteOne({ code });

    if (result.deletedCount === 0) {
      return error("Failed to delete Language", 404);
    }

    return success({ code });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function findLanguage(code: string, name?: string) {
  if (!code) return error("Empty Language code");

  try {
    const { languages } = await getCollections();
    const q = name
      ? {
          $or: [
            { code: code.toLowerCase() },
            { name: { $regex: `^${name}`, $options: "i" } },
          ],
        }
      : { code };

    const language = await languages.findOne(q);

    if (!language) {
      return error("Language not found", 404);
    }

    return success(language);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function findLanguageByName(name: string) {
  if (!name) return error("Empty Language name");

  try {
    const { languages } = await getCollections();
    const language = await languages.findOne({
      name: { $regex: `^${name}`, $options: "i" },
    });

    if (!language) {
      return error("Language not found", 404);
    }

    return success(language);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function findLanguageByCode2(code2: string) {
  if (!code2) return error("Empty Language code2");

  try {
    const { languages } = await getCollections();

    const language = await languages.findOne({
      code2: { $regex: code2, $options: "i" },
    });

    if (!language) {
      return error("Language not found", 404);
    }

    return success(language);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function findLanguages() {
  try {
    const { languages } = await getCollections();
    const result = await languages.find<Language>({}).toArray();

    return success(result);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function createLanguages(languages: Language[]) {
  if (!languages?.length)
    return error("Empty languages array can not be created.");

  try {
    const { languages: collection } = await getCollections();

    const result = await collection.insertMany(languages);

    if (!result.insertedCount) {
      return error("Failed to create languages");
    }

    return success(
      languages.map((language, index) => ({
        ...language,
        id: result.insertedIds[index],
      })),
    );
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}
