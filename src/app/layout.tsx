import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ContextSync from "@/components/ContextSync";
import { getUserContext } from "@/lib/contexts/user/UserContext.service";
import { getTenantConfig } from "@/lib/contexts/tenant/Tenant.validators";
import Header from "@/components/Header";

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
  const userCtx = await getUserContext();
  const tenantConfig = await getTenantConfig(userCtx.tenantId || "");
  if (!userCtx || !tenantConfig) return null;

  return (
    <html lang={userCtx.language}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          background: tenantConfig?.theme.mode === "dark" ? "#000" : "#fff",
          color: tenantConfig?.theme.mode === "dark" ? "#fff" : "#000",
        }}
      >
        <ContextSync context={userCtx} />
        <Header userCtx={userCtx} tenantConfig={tenantConfig} />
        {children}
      </body>
    </html>
  );
}
