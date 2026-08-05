import { Newspaper, Globe, Rss } from "lucide-react";

import { Github, Twitter, Instagram } from "@/components/ui/simple-icons";
import NoPrefetchLink from "./NoPrefetchLink";
import SubscribeNewsLetter from "./SubscribeNewsLetter";
import { PageTypeEnum, UserContext } from "@worldnews/shared/types";
import { resolveHomeUrl, resolveUrl } from "@/lib/contexts/url/Url.Resolver";
import TenantLogo from "./TenantLogo";
import { STATIC_PAGES } from "@/app-constants/staticPages.constant";

interface SiteFooterProps {
  userCtx: UserContext;
}

export default function SiteFooter({ userCtx }: SiteFooterProps) {
  const companyName = userCtx.tenantCtx?.tenant?.name || "My Company";
  const brandDisplayName =
    userCtx.tenantCtx?.tenant?.settings?.branding.displayName || "";
  const logoUrl = userCtx.tenantCtx?.tenant?.settings?.branding.logoUrl || "";

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 font-sans">
      {/* ================= MAIN FOOTER CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <TenantLogo displayName={brandDisplayName} logoUrl={logoUrl} />
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              Your real-time news aggregator. We index breaking global
              headlines, technology signals, and curated topics directly from
              verified publishers.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <NoPrefetchLink
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-blue-600 flex items-center justify-center transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </NoPrefetchLink>
              <NoPrefetchLink
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-blue-600 flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </NoPrefetchLink>
              <NoPrefetchLink
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors"
              >
                <Github className="w-4 h-4" />
              </NoPrefetchLink>
              <NoPrefetchLink
                href={resolveUrl(userCtx, undefined, STATIC_PAGES.FEEDS)}
                aria-label="RSS Feed"
                className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-orange-500 flex items-center justify-center transition-colors"
              >
                <Rss className="w-4 h-4" />
              </NoPrefetchLink>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Platform
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <NoPrefetchLink
                  href={resolveUrl(userCtx, PageTypeEnum.category, "top")}
                  className="hover:text-blue-600 transition-colors"
                >
                  Top Stories
                </NoPrefetchLink>
              </li>
              <li>
                <NoPrefetchLink
                  href={resolveUrl(
                    userCtx,
                    PageTypeEnum.category,
                    "technology",
                  )}
                  className="hover:text-blue-600 transition-colors"
                >
                  Technology News
                </NoPrefetchLink>
              </li>
              <li>
                <NoPrefetchLink
                  href={resolveUrl(userCtx, PageTypeEnum.category, "business")}
                  className="hover:text-blue-600 transition-colors"
                >
                  Financial Markets
                </NoPrefetchLink>
              </li>
              <li>
                <NoPrefetchLink
                  href={resolveUrl(userCtx, PageTypeEnum.category, "world")}
                  className="hover:text-blue-600 transition-colors"
                >
                  World News
                </NoPrefetchLink>
              </li>
              {/* <li>
                <NoPrefetchLink
                  href="/sources"
                  className="hover:text-blue-600 transition-colors"
                >
                  Indexed Sources
                </NoPrefetchLink>
              </li> */}
            </ul>
          </div>

          {/* Column 3: Company & Legal */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <NoPrefetchLink
                  href={resolveUrl(userCtx, undefined, STATIC_PAGES.ABOUT)}
                  className="hover:text-blue-600 transition-colors"
                >
                  About Us
                </NoPrefetchLink>
              </li>
              <li>
                <NoPrefetchLink
                  href={resolveUrl(userCtx, undefined, STATIC_PAGES.CONTACT)}
                  className="hover:text-blue-600 transition-colors"
                >
                  Contact Us
                </NoPrefetchLink>
              </li>
              <li>
                <NoPrefetchLink
                  href={resolveUrl(userCtx, undefined, STATIC_PAGES.TERMS)}
                  className="hover:text-blue-600 transition-colors"
                >
                  Terms & Conditions
                </NoPrefetchLink>
              </li>
              <li>
                <NoPrefetchLink
                  href={resolveUrl(userCtx, undefined, STATIC_PAGES.PRIVACY)}
                  className="hover:text-blue-600 transition-colors"
                >
                  Privacy Policy
                </NoPrefetchLink>
              </li>
              {/* <li>
                <NoPrefetchLink
                  href="/publishers"
                  className="hover:text-blue-600 transition-colors"
                >
                  Publisher Program
                </NoPrefetchLink>
              </li> */}
            </ul>
          </div>

          {/* Column 4: Newsletter Signup */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Daily Digest
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Get top aggregated headlines delivered directly to your inbox
              every morning.
            </p>

            {/* Subscribe to News letter */}
            <SubscribeNewsLetter />
          </div>
        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="border-t border-slate-100 bg-slate-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} {companyName}. All rights
            reserved.
          </p>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>Global Edition</span>
            </div>
            <NoPrefetchLink
              href={resolveUrl(userCtx, undefined, STATIC_PAGES.TERMS)}
              className="hover:text-slate-700 transition-colors"
            >
              Terms
            </NoPrefetchLink>
            <NoPrefetchLink
              href={resolveUrl(userCtx, undefined, STATIC_PAGES.PRIVACY)}
              className="hover:text-slate-700 transition-colors"
            >
              Privacy
            </NoPrefetchLink>
            <NoPrefetchLink
              href={resolveUrl(userCtx, undefined, STATIC_PAGES.CONTACT)}
              className="hover:text-slate-700 transition-colors"
            >
              Support
            </NoPrefetchLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
