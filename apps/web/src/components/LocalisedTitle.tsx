import { UserContext } from "@worldnews/shared/types";

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
      {prefix ? prefix + " " : ""}
      {/* {country ? `${country} ` : ""} {region ? `| ${region}` : ""} */}
      {/* {city ? `| ${city}` : ""} {language ? `| ${language}` : ""} {title}{" "} */}
      {/* {ip ? `[${ip}]` : ""} */}
      {title}
      {postfix ? " " + postfix : ""}
    </>
  );
}
