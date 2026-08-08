import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getUserContext } from "@/lib/contexts/user/UserContext.service";
import Header from "@/components/Header";
import { AppContextProvider } from "@/components/AppContext.Provider";
import SiteFooter from "@/components/SiteFooter";
import { PageTypeEnum } from "@worldnews/shared";
import { STATIC_PAGES } from "@/app-constants/staticPages.constant";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GONE | Global Omni Channel News",
  description: "Global Omni Channel News",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Skip at build time while pre rendering, send every request to not_found
  // if (process.env.IS_BUILD_STEP) {
  //   return <div>Skipping pre rendering during build...</div>;
  // }

  const userCtx = await getUserContext();

  const tenantConfig = userCtx.tenantCtx?.tenant?.settings!;

  const isNewsReelsMode =
    !userCtx.pageType && userCtx.pageId === STATIC_PAGES.NEWSREELS;

  return (
    <html lang={userCtx.language}>
      <head>
        {/* searchadvisor.naver.com varification */}
        <meta
          name="naver-site-verification"
          content="9598f97929740b183fab3938bcb78b2d5fa8031f"
        />
        {/* Bing Verification */}
        <meta name="msvalidate.01" content="B87BEBE8ADA6D0D22072BE3554D378EE" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased mt-30-md`}
        style={{
          background: tenantConfig?.theme.mode === "dark" ? "#000" : "#fff",
          color: tenantConfig?.theme.mode === "dark" ? "#fff" : "#000",
        }}
      >
        <AppContextProvider value={{ userCtx }}>
          {!isNewsReelsMode && (
            <>
              <Header />
              <div
                className={`max-w-full mx-auto px-0 ${tenantConfig?.navigation.style === "smart" ? "md:py-22 px-0 py-14" : ""}`}
              >
                {children}
              </div>
              <SiteFooter userCtx={userCtx} />
            </>
          )}
          {isNewsReelsMode && <>{children}</>}
        </AppContextProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
