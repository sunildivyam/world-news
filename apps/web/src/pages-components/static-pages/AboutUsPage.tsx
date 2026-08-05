// Lucide Icons (Standard for modern React/Next apps)
import {
  Globe2,
  Zap,
  ShieldCheck,
  ArrowRight,
  Mail,
  CheckCircle2,
} from "lucide-react";
import NoPrefetchLink from "@/components/NoPrefetchLink";
import { UserContext } from "@worldnews/shared/types";
import { resolveHomeUrl, resolveUrl } from "@/lib/contexts/url/Url.Resolver";
import { STATIC_PAGES } from "@/app-constants/staticPages.constant";
import { SlideUp, ScaleIn } from "@worldnews/shared/motion";

interface AboutUsPageProps {
  userCtx: UserContext;
  companyName: string;
  contactEmail: string;
}
export default function AboutUsPage({
  userCtx,
  companyName,
  contactEmail,
}: AboutUsPageProps) {
  return (
    <>
      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white font-sans antialiased">
        {/* ================= HERO SECTION ================= */}

        <SlideUp
          as="section"
          className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28 border-b border-slate-800/80 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))]"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-xs font-medium text-blue-400 mb-8 backdrop-blur-md shadow-inner">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              The Next-Gen News Ecosystem
            </div>

            {/* Main Hero Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
              Bringing{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400">
                Clarity
              </span>{" "}
              to the Global Stream
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {companyName} organizes thousands of real-time feeds, breaking
              wire reports, and independent outlets into a single, clutter-free
              intelligence portal.
            </p>

            {/* Hero CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <NoPrefetchLink
                href={resolveHomeUrl(userCtx)}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-600/25 active:scale-95 gap-2"
              >
                Explore Live Feed
                <ArrowRight className="w-4 h-4" />
              </NoPrefetchLink>
              <a
                href="#mission"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition-all active:scale-95"
              >
                Our Philosophy
              </a>
            </div>

            {/* Quick Feature Chips */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                Zero Clickbait Algorithms
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                100% Direct Source Attribution
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                Real-Time RSS Pipelines
              </div>
            </div>
          </div>
        </SlideUp>

        {/* ================= METRICS GRID ================= */}
        <ScaleIn
          as="section"
          className="py-12 bg-slate-900/50 border-b border-slate-800/80"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  5,000+
                </p>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">
                  Curated Sources
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  24/7
                </p>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">
                  Live Feed Indexing
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  &lt; 50ms
                </p>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">
                  Pipeline Latency
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  100%
                </p>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">
                  Publisher Traffic Routing
                </p>
              </div>
            </div>
          </div>
        </ScaleIn>

        {/* ================= CORE VALUES (CARDS SECTION) ================= */}
        <SlideUp as="section" className="py-20 md:py-28 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold tracking-widest text-blue-400 uppercase">
                Designed For Modern Readers
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Built to Fix Information Overload
              </h2>
              <p className="mt-4 text-slate-400">
                Traditional news aggregation is bloated with duplicate headlines
                and hidden paywalls. {companyName} delivers a streamlined,
                transparent experience.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 shadow-sm group">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Publisher First
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  We champion original reporting. Every article indexed on{" "}
                  {companyName} prominently credits creators and directs readers
                  straight to publisher domains.
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 shadow-sm group">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                  <Globe2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Balanced Perspectives
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  By grouping related stories across multiple independent
                  outlets side-by-side, we give readers a complete, well-rounded
                  view on major world events.
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 shadow-sm group">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Instant Speed
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Our high-throughput aggregation backend ingests news, tech
                  blogs, and market signals seconds after publication with
                  near-zero latency.
                </p>
              </div>
            </div>
          </div>
        </SlideUp>

        {/* ================= HOW IT WORKS SECTION ================= */}
        <SlideUp
          as="section"
          className="py-20 bg-slate-900/30 border-y border-slate-800/80"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-xs font-bold tracking-widest text-blue-400 uppercase">
                  Under The Hood
                </span>
                <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  How {companyName} Curation Works
                </h2>
                <p className="mt-4 text-slate-400 leading-relaxed">
                  Our platform processes millions of data points every day to
                  synthesize headlines into focused topics without compromising
                  story integrity.
                </p>

                <div className="mt-8 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-blue-400 font-bold text-sm shrink-0 border border-slate-700">
                      1
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-white">
                        Ingestion & De-duplication
                      </h4>
                      <p className="text-sm text-slate-400 mt-1">
                        Filtering out redundant content, syndication noise, and
                        duplicate wires automatically.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-blue-400 font-bold text-sm shrink-0 border border-slate-700">
                      2
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-white">
                        Smart Topic Classification
                      </h4>
                      <p className="text-sm text-slate-400 mt-1">
                        Categorizing stories across technology, markets, policy,
                        culture, and localized coverage.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-blue-400 font-bold text-sm shrink-0 border border-slate-700">
                      3
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-white">
                        Direct Reader Redirection
                      </h4>
                      <p className="text-sm text-slate-400 mt-1">
                        Delivering snippet previews and handing full reading
                        experiences back to the source.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Tech Preview Box */}
              <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl relative">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    Live Aggregator Stream
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs text-slate-300">
                  <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                    <span className="text-blue-400 truncate">
                      techcrunch.com/article/ai-breakthrough
                    </span>
                    <span className="text-slate-500 text-[10px] shrink-0 ml-2">
                      Just now
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                    <span className="text-blue-400 truncate">
                      reuters.com/markets/global-economy
                    </span>
                    <span className="text-slate-500 text-[10px] shrink-0 ml-2">
                      2m ago
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                    <span className="text-blue-400 truncate">
                      wired.com/story/cybersecurity-update
                    </span>
                    <span className="text-slate-500 text-[10px] shrink-0 ml-2">
                      5m ago
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SlideUp>

        {/* ================= PUBLISHER & CONTACT BANNER ================= */}
        <ScaleIn
          as="section"
          className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 border border-slate-800 p-8 sm:p-12 md:p-16 text-center relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Are You a Publisher or Media Partner?
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                We are constantly expanding our partner network. If you'd like
                your publication indexed, request updates, or give product
                feedback, reach out to our team.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={resolveUrl(userCtx, undefined, STATIC_PAGES.CONTACT)}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-lg active:scale-95 gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </ScaleIn>
      </div>
    </>
  );
}
