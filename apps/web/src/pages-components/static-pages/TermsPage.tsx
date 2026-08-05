interface TermsPageProps {
  companyName: string;
  contactEmail: string;
}
export default function TermsPage({
  companyName,
  contactEmail,
}: TermsPageProps) {
  const lastUpdated = "August 5, 2026";

  return (
    <>
      <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <header className="mb-10 text-center sm:text-left border-b border-slate-200 pb-8">
            <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
              Legal Framework
            </span>
            <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Terms & Conditions
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
                  href="#acceptance"
                  className="block hover:text-blue-600 transition-colors"
                >
                  1. Acceptance of Terms
                </a>
                <a
                  href="#aggregator-nature"
                  className="block hover:text-blue-600 transition-colors"
                >
                  2. Nature of Service
                </a>
                <a
                  href="#ip-rights"
                  className="block hover:text-blue-600 transition-colors"
                >
                  3. Intellectual Property
                </a>
                <a
                  href="#user-conduct"
                  className="block hover:text-blue-600 transition-colors"
                >
                  4. User Conduct
                </a>
                <a
                  href="#third-party"
                  className="block hover:text-blue-600 transition-colors"
                >
                  5. Third-Party Content
                </a>
                <a
                  href="#disclaimers"
                  className="block hover:text-blue-600 transition-colors"
                >
                  6. Disclaimers
                </a>
                <a
                  href="#liability"
                  className="block hover:text-blue-600 transition-colors"
                >
                  7. Limitation of Liability
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
              <section id="acceptance" className="scroll-mt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  1. Acceptance of Terms
                </h2>
                <p>
                  Welcome to <strong>{companyName}</strong>. By accessing or
                  using our website, dynamic RSS feeds, mobile platforms, or
                  news aggregation services, you agree to be bound by these
                  Terms and Conditions ("Terms"). If you do not agree with any
                  part of these terms, you must discontinue your use of our
                  service immediately.
                </p>
              </section>

              <hr className="border-slate-100" />

              <section id="aggregator-nature" className="scroll-mt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  2. Nature of the Service
                </h2>
                <p>
                  {companyName} is an automated news aggregator. We gather,
                  summarize, categorize, and link to news articles, headlines,
                  media, and public updates from third-party websites across the
                  web.
                </p>
                <p className="mt-2">
                  Unless explicitly stated, {companyName} does not independently
                  author or original-produce the linked news coverage. We do not
                  guarantee the timeliness, truthfulness, accuracy, or
                  completeness of third-party reporting.
                </p>
              </section>

              <hr className="border-slate-100" />

              <section id="ip-rights" className="scroll-mt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  3. Intellectual Property & Fair Use
                </h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Third-Party Content:</strong> All trade names,
                    trademarks, article titles, logos, and original content
                    sourced from external publishers belong to their respective
                    copyright holders.
                  </li>
                  <li>
                    <strong>Fair Use:</strong> {companyName} displays snippets,
                    titles, and thumbnails under fair use principles to direct
                    internet traffic to the original content publishers.
                  </li>
                  <li>
                    <strong>Platform Rights:</strong> The design, layout, code,
                    software, and proprietary algorithms of the {companyName}{" "}
                    portal are the exclusive property of {companyName}.
                  </li>
                </ul>
              </section>

              <hr className="border-slate-100" />

              <section id="user-conduct" className="scroll-mt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  4. User Conduct
                </h2>
                <p>When using {companyName}, you agree not to:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>
                    Scrape, crawl, or extract platform data at scale without our
                    explicit written consent.
                  </li>
                  <li>
                    Circumvent or bypass any security features or rate limits
                    established on the portal.
                  </li>
                  <li>
                    Use automated bots or scripts to interact with our
                    bookmarking or rating features.
                  </li>
                </ul>
              </section>

              <hr className="border-slate-100" />

              <section id="third-party" className="scroll-mt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  5. Third-Party Links & External Sites
                </h2>
                <p>
                  Our portal contains external hyperlinks leading directly to
                  third-party publisher websites. {companyName} has no control
                  over, and assumes no responsibility for, the content, privacy
                  policies, or security practices of any external sites.
                  Clicking an external link subjects you to that third party's
                  terms and conditions.
                </p>
              </section>

              <hr className="border-slate-100" />

              <section id="disclaimers" className="scroll-mt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  6. Warranties & Disclaimers
                </h2>
                <p className="uppercase text-xs font-semibold tracking-wide text-slate-500 mb-2">
                  Provided "As Is"
                </p>
                <p>
                  THE SERVICES PROVIDED BY {companyName} ARE DELIVERED ON AN "AS
                  IS" AND "AS AVAILABLE" BASIS. WE DISCLAIM ALL WARRANTIES OF
                  ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT
                  LIMITED TO ACCURACY, RELIABILITY, FITNESS FOR A PARTICULAR
                  PURPOSE, AND NON-INFRINGEMENT.
                </p>
              </section>

              <hr className="border-slate-100" />

              <section id="liability" className="scroll-mt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  7. Limitation of Liability
                </h2>
                <p>
                  To the fullest extent permitted by law, {companyName}, its
                  directors, employees, and partners shall not be held liable
                  for any indirect, incidental, punitive, or consequential
                  damages resulting from your reliance on news or information
                  indexed through our portal.
                </p>
              </section>

              <hr className="border-slate-100" />

              <section id="contact" className="scroll-mt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  8. Contact Us & Copyright Complaints
                </h2>
                <p>
                  If you are a publisher who wishes to have your content removed
                  or adjusted on {companyName}, or if you have questions
                  regarding these Terms, please reach out to our legal
                  compliance team:
                </p>
                <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="font-semibold text-slate-900">
                    {companyName} Legal Team
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
