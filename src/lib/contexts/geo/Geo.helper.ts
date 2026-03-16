import { countryList } from "@/app-constants/countries.constant";

export const isCountry = (countryCode: string) =>
  !!countryList.find((c) => c.code.toLowerCase() === countryCode.toLowerCase());

export const isRegion = (countryCode: string, regionCode: string) => {
  const country = countryList.find(
    (c) => c.code.toLowerCase() === countryCode.toLowerCase(),
  );
  const region = (country?.regions || []).find(
    (r) => r.code.toLowerCase() === regionCode.toLowerCase(),
  );
  return !!region;
};

export const isCity = (
  countryCode: string,
  regionCode: string,
  cityCode: string,
) => {
  const country = countryList.find(
    (c) => c.code.toLowerCase() === countryCode.toLowerCase(),
  );
  const region = (country?.regions || []).find(
    (r) => r.code.toLowerCase() === regionCode.toLowerCase(),
  );
  const city = (region?.cities || []).find(
    (ct) => ct.code.toLowerCase() === cityCode.toLowerCase(),
  );

  return !!city;
};
