export const dynamic = "force-dynamic";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getUserContext } from "@/lib/contexts/user/UserContext.service";
import { getTenantConfig } from "@/lib/contexts/tenant/Tenant.validators";
import Header from "@/components/Header";
import { AppContextProvider } from "@/components/AppContext.Provider";

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
  if (process.env.IS_BUILD_STEP) {
    return <div>Skipping pre rendering during build...</div>;
  }

  const userCtx = await getUserContext();

  const tenantConfig = userCtx.tenantCtx?.tenant?.settings!;

  return (
    <html lang={userCtx.language}>
      <head></head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased mt-30-md`}
        style={{
          background: tenantConfig?.theme.mode === "dark" ? "#000" : "#fff",
          color: tenantConfig?.theme.mode === "dark" ? "#fff" : "#000",
        }}
      >
        <AppContextProvider value={{ userCtx }}>
          <Header />
          <div
            className={`max-w-full mx-auto px-0 ${tenantConfig?.navigation.style === "smart" ? "md:py-22 px-0 py-14" : ""}`}
          >
            {children}
          </div>
        </AppContextProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
