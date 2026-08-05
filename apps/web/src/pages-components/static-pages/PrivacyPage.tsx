interface PrivacyPageProps {
  companyName: string;
  contactEmail: string;
}

export default function PrivacyPage({
  companyName,
  contactEmail,
}: PrivacyPageProps) {
  const lastUpdated = "August 5, 2026";

  return (
    <>
      <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <header className="mb-10 text-center sm:text-left border-b border-slate-200 pb-8">
            <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
              Data & Protection
            </span>
            <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Privacy Policy
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Last updated on <time dateTime="2026-08-05">{lastUpdated}</time>
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Table of Contents (Desktop Sticky Sidebar) */}
            <aside className="hidden lg:block lg:col-span-1">
              <nav className="sticky top-8 space-y-2 text-sm font-medium text-slate-600 border-l border-slate-200 pl-4">
                <a
                  href="#overview"
                  className="block hover:text-blue-600 transition-colors"
                >
                  1. Overview
                </a>
                <a
                  href="#info-collected"
                  className="block hover:text-blue-600 transition-colors"
                >
                  2. Information We Collect
                </a>
                <a
                  href="#how-we-use"
                  className="block hover:text-blue-600 transition-colors"
                >
                  3. How We Use Data
                </a>
                <a
                  href="#cookies"
                  className="block hover:text-blue-600 transition-colors"
                >
                  4. Cookies & Analytics
                </a>
                <a
                  href="#third-parties"
                  className="block hover:text-blue-600 transition-colors"
                >
                  5. External Publishers
                </a>
                <a
                  href="#data-rights"
                  className="block hover:text-blue-600 transition-colors"
                >
                  6. Your Data Rights
                </a>
                <a
                  href="#security"
                  className="block hover:text-blue-600 transition-colors"
                >
                  7. Data Security
                </a>
                <a
                  href="#contact"
                  className="block hover:text-blue-600 transition-colors"
                >
                  8. Contact Us
                </a>
              </nav>
            </aside>

            {/* Main Legal Content */}
            <main className="lg:col-span-3 space-y-8 text-slate-700 leading-relaxed bg-white p-6 sm:p-10 rounded-xl shadow-sm border border-slate-200">
              <section id="overview" className="scroll-mt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  1. Overview
                </h2>
                <p>
                  At <strong>{companyName}</strong>, accessible from our online
                  portal, app, and associated services, protecting your privacy
                  is one of our primary priorities. This Privacy Policy document
                  outlines the types of information that is collected and
                  recorded by {companyName} and how we use it.
                </p>
              </section>

              <hr className="border-slate-100" />

              <section id="info-collected" className="scroll-mt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  2. Information We Collect
                </h2>
                <p>
                  We collect information to provide better news curation to all
                  our users. This includes:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>
                    <strong>Automatically Collected Log Data:</strong> When you
                    access our portal, our servers record standard log
                    information such as your IP address, browser type, device
                    details, referring URLs, and timestamps.
                  </li>
                  <li>
                    <strong>Usage Data:</strong> We track anonymous interactions
                    with our content feeds, such as categories clicked, search
                    queries executed, and topics bookmarked.
                  </li>
                  <li>
                    <strong>Account Data (Optional):</strong> If you register an
                    account to save preference filters or subscribe to
                    newsletters, we collect basic details such as your name and
                    email address.
                  </li>
                </ul>
              </section>

              <hr className="border-slate-100" />

              <section id="how-we-use" className="scroll-mt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  3. How We Use Your Information
                </h2>
                <p>
                  The data we collect is used strictly for legitimate business
                  purposes, including:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>
                    Personalizing your news feed and content recommendations
                    based on reading preferences.
                  </li>
                  <li>
                    Maintaining, optimizing, and monitoring the technical
                    performance of our portal.
                  </li>
                  <li>
                    Preventing fraudulent behavior, unauthorized automated
                    scraping, and security breaches.
                  </li>
                  <li>
                    Sending optional news summaries or service updates (if you
                    have opted in).
                  </li>
                </ul>
              </section>

              <hr className="border-slate-100" />

              <section id="cookies" className="scroll-mt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  4. Cookies & Web Beacons
                </h2>
                <p>
                  Like any other website, {companyName} uses 'cookies'. These
                  cookies store information including visitors' preferences and
                  the pages on the website that the visitor accessed or visited.
                </p>
                <p className="mt-2">
                  We use cookies for session persistence (keeping you logged
                  in), storing local feed settings, and serving privacy-friendly
                  aggregated analytics. You can choose to disable cookies
                  through your individual browser options.
                </p>
              </section>

              <hr className="border-slate-100" />

              <section id="third-parties" className="scroll-mt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  5. External Publishers & Advertisers
                </h2>
                <p>
                  {companyName} links to external news websites that operate
                  independently from us. Once you click an outbound link to read
                  a full article on an external publisher's domain, our Privacy
                  Policy no longer applies.
                </p>
                <p className="mt-2">
                  We advise you to consult the respective privacy policies of
                  these third-party news sites for more detailed information on
                  their tracking mechanisms and opt-out instructions.
                </p>
              </section>

              <hr className="border-slate-100" />

              <section id="data-rights" className="scroll-mt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  6. Your Data Rights (GDPR / CCPA)
                </h2>
                <p>
                  Depending on your jurisdiction, you have specific rights
                  regarding your personal information:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>
                    <strong>The Right to Access:</strong> You can request copies
                    of your personal data held by us.
                  </li>
                  <li>
                    <strong>The Right to Rectification:</strong> You can request
                    that we correct inaccurate information.
                  </li>
                  <li>
                    <strong>The Right to Erasure:</strong> You can request that
                    we erase your personal data ("Right to be Forgotten").
                  </li>
                  <li>
                    <strong>Do Not Sell My Info:</strong> {companyName} does not
                    sell, rent, or lease your personal identifiers to
                    third-party data brokers.
                  </li>
                </ul>
              </section>

              <hr className="border-slate-100" />

              <section id="security" className="scroll-mt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  7. Data Security
                </h2>
                <p>
                  We implement standard administrative, technical, and physical
                  security measures (including HTTPS encryption) designed to
                  protect your personal information. However, no electronic
                  transmission over the internet can be guaranteed to be 100%
                  secure.
                </p>
              </section>

              <hr className="border-slate-100" />

              <section id="contact" className="scroll-mt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  8. Contact Our Data Protection Officer
                </h2>
                <p>
                  If you have additional questions or require more information
                  about our Privacy Policy or data handling practices, do not
                  hesitate to contact us:
                </p>
                <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="font-semibold text-slate-900">
                    {companyName} Privacy Team
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    Email:{" "}
                    <a
                      href={`mailto:${contactEmail}`}
                      className="text-blue-600 hover:underline"
                    >
                      {contactEmail}
                    </a>
                  </p>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
