import { STATIC_PAGES } from "@/app-constants/staticPages.constant";

import { UserContext } from "@worldnews/shared/types";
import TermsPage from "./static-pages/TermsPage";
import PrivacyPage from "./static-pages/PrivacyPage";
import AboutUsPage from "./static-pages/AboutUsPage";
import ContactUsPage from "./static-pages/ContactUsPage";
import FeedsPage from "./static-pages/FeedsPage";

export default async function StaticPage({
  userContext,
  slug,
}: {
  userContext: UserContext;
  slug: string;
}) {
  const companyName = userContext.tenantCtx?.tenant?.name || "My Company";
  const contactEmail =
    userContext.tenantCtx?.tenant?.contactEmail || `legal@mycompany.com`;
  return (
    <>
      <main className="max-w-full mx-auto px-0 py-0">
        {slug === STATIC_PAGES.TERMS && (
          <TermsPage companyName={companyName} contactEmail={contactEmail} />
        )}
        {slug === STATIC_PAGES.PRIVACY && (
          <PrivacyPage companyName={companyName} contactEmail={contactEmail} />
        )}
        {slug === STATIC_PAGES.ABOUT && (
          <AboutUsPage
            userCtx={userContext}
            companyName={companyName}
            contactEmail={contactEmail}
          />
        )}
        {slug === STATIC_PAGES.CONTACT && (
          <ContactUsPage
            companyName={companyName}
            contactEmail={contactEmail}
          />
        )}
        {slug === STATIC_PAGES.FEEDS && (
          <FeedsPage companyName={companyName} contactEmail={contactEmail} />
        )}
      </main>
    </>
  );
}
