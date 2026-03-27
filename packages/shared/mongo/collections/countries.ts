/* eslint-disable @typescript-eslint/no-explicit-any */
import { City, Country } from "../../types";
import { error, success } from "../response";
import { getCollections } from "../collections";
import { InsertOneResult } from "mongodb";

export async function createCountry(country: Country) {
  if (!country?.code) return error("Can not create an empty country");

  try {
    const { countries } = await getCollections();

    const result: InsertOneResult = await countries.insertOne(country);

    if (!result.insertedId) {
      return error("Failed to create country", 500);
    }

    return success({ ...country, id: result.insertedId });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function getAllCountries() {
  try {
    const { countries } = await getCollections();
    const result = await countries
      .find({})
      .project({ code: 1, name: 1, languages: 1 })
      .toArray();

    return success(result);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function updateCountry(code: string, country: Partial<Country>) {
  try {
    const { countries } = await getCollections();
    const result = await countries.updateOne({ code }, { $set: country });

    if (result.matchedCount === 0) {
      return error("Country not found", 404);
    }

    return success({ code });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function updateCountryByGeo(
  countryCode: string = "",
  regionCode: string = "",
  cityCode: string = "",
  languageCode: string = "",
) {
  try {
    const { countries } = await getCollections();

    const country = await countries.findOne({ code: countryCode });

    if (!country) {
      const newCountry: Country = {
        code: countryCode,
        name: countryCode,
        regions: regionCode
          ? [
              {
                code: regionCode,
                name: regionCode,
                languages: languageCode ? [languageCode] : [],
                cities: cityCode
                  ? [
                      {
                        code: cityCode,
                        name: cityCode,
                        languages: languageCode ? [languageCode] : [],
                      },
                    ]
                  : [],
              },
            ]
          : [],
        languages: languageCode ? [languageCode] : [],
      };

      return createCountry(newCountry);
    }

    const updateData: any = {};

    if (regionCode) {
      const regionExists = country.regions?.some(
        (r: any) => r.code === regionCode,
      );
      if (!regionExists) {
        updateData.regions = [
          ...(country.regions || []),
          {
            code: regionCode,
            name: regionCode,
            languages: languageCode ? [languageCode] : [],
            cities: cityCode
              ? [
                  {
                    code: cityCode,
                    name: cityCode,
                    languages: languageCode ? [languageCode] : [],
                  },
                ]
              : [],
          },
        ];
      } else if (cityCode) {
        updateData.regions = country.regions.map((r: any) =>
          r.code === regionCode
            ? {
                ...r,
                languages: addLanguage(languageCode, r.languages),
                cities: r.cities?.find((c: City) => c.code === cityCode)
                  ? [
                      ...r.cities.map((c: City) =>
                        c.code === cityCode
                          ? {
                              ...c,
                              languages: addLanguage(languageCode, c.languages),
                            }
                          : c,
                      ),
                    ]
                  : [
                      ...r.cities,
                      {
                        code: cityCode,
                        name: cityCode,
                        languages: languageCode ? [languageCode] : [],
                      },
                    ],
              }
            : r,
        );
      }
    }

    if (languageCode) {
      const langExists = country.languages?.some(
        (l: string) => l === languageCode,
      );
      if (!langExists) {
        updateData.languages = [...(country.languages || []), languageCode];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return error("Nothing to update in country.");
    }

    return updateCountry(countryCode, updateData);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function deleteCountry(code: string) {
  try {
    const { countries } = await getCollections();
    const result = await countries.deleteOne({ code });

    if (result.deletedCount === 0) {
      return error("Country not found", 404);
    }

    return success({ code });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function findCountry(code: string, name?: string) {

  try {
    const { countries } = await getCollections();

    const q = name
      ? {
          $or: [
            { code: code.toLowerCase() },
            { name: { $regex: `^${name}`, $options: "i" } },
          ],
        }
      : { code: code.toLowerCase() };

    const country = await countries.findOne(q);

    if (!country) {
      return error("Country not found", 404);
    }

    return success(country);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function findCountryByName(name: string) {

  try {
    const { countries } = await getCollections();
    const country = await countries.findOne({
      name: { $regex: `^${name}`, $options: "i" },
    });

    if (!country) {
      return error("Country not found", 404);
    }

    return success(country);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

function addLanguage(code: string, languages: string[]) {
  return languages?.includes(code) ? [...languages] : [...languages, code];
}
