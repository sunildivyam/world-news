import Header from "@/components/Header";
import LocalisedTitle from "@/components/LocalisedTitle";
import { UserContext } from "@/lib/contexts/user/UserContext.interface";

export default async function StaticPage({
  userContext,
  slug,
}: {
  userContext: UserContext;
  slug: string;
}) {
  // 1. Await params (Required in Next.js 15)

  return (
    <>
      <Header />
      <main className="max-w-full mx-auto px-0 py-0">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 capitalize text-brand">
            <LocalisedTitle
              userContext={userContext}
              title={slug}
              postfix="News"
            />
          </h1>
        </div>

        <h1>STATIC PAGES (one of the)</h1>
      </main>
    </>
  );
}
