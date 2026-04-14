import type { ArticleContent, ArticleSection } from "@worldnews/shared/types";

interface Props {
  content: ArticleContent;
}

export default function ArticleBody({ content }: Props) {
  return (
    <>
      {content.map((s: ArticleSection, index: number) => {
        const key = `section-${index}`;

        switch (s.type) {
          case "h1":
            return (
              <h1
                key={key}
                className="text-4xl font-extrabold tracking-tight text-gray-900 mt-8 mb-4"
              >
                {s.value}
              </h1>
            );
          case "h2":
            return (
              <h2
                key={key}
                className="text-3xl font-bold text-gray-900 mt-10 mb-4 border-b pb-2"
              >
                {s.value}
              </h2>
            );
          case "h3":
            return (
              <h3
                key={key}
                className="text-2xl font-bold text-gray-800 mt-8 mb-3"
              >
                {s.value}
              </h3>
            );
          case "h4":
            return (
              <h4
                key={key}
                className="text-xl font-bold text-gray-800 mt-6 mb-2"
              >
                {s.value}
              </h4>
            );
          case "h5":
            return (
              <h5
                key={key}
                className="text-xl font-bold text-gray-800 mt-6 mb-2"
              >
                {s.value}
              </h5>
            );
          case "h6":
            return (
              <h6
                key={key}
                className="text-xl font-bold text-gray-800 mt-6 mb-2"
              >
                {s.value}
              </h6>
            );
          case "p":
            return (
              <p key={key} className="mb-5 text-lg text-gray-700">
                {s.value}
              </p>
            );

          case "ul":
          case "ol":
            const ListTag = s.type;
            const listClasses = s.type === "ul" ? "list-disc" : "list-decimal";

            return (
              <div key={key} className="my-6">
                {/* Render the list title we added to the schema */}
                {/* {s.title && (
                  <p className="font-bold text-gray-900 mb-2">{s.title}</p>
                )} */}

                <ListTag
                  className={`${listClasses} ml-6 space-y-2 text-gray-700`}
                >
                  {s.items?.map((item: string, i: number) => (
                    <li key={i} className="pl-1">
                      {item}
                    </li>
                  ))}
                </ListTag>
              </div>
            );

          default:
            return (
              <p key={key} className="mb-4">
                {s.value}
              </p>
            );
        }
      })}
    </>
  );
}
