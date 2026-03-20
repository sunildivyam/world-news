import { UserContext } from "@worldnews/shared";

interface LocalisedTitleProps {
  title: string;
  userContext: UserContext;
  prefix?: string;
  postfix?: string;
}

export default function LocalisedTitle({
  title,
  userContext,
  prefix,
  postfix,
}: LocalisedTitleProps) {
  const { country, region, city, language, ip } = userContext?.geo ?? {};

  return (
    <>
      {title} Today
      {/* {prefix ?? ""}
      {country ? `${country} ` : ""} {region ? `| ${region}` : ""}
      {city ? `| ${city}` : ""} {language ? `| ${language}` : ""} {title}{" "}
      {postfix ?? ""} {ip ? `[${ip}]` : ""} */}
    </>
  );
}
