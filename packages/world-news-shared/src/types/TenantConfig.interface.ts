import type { PageSection } from "./PageSection.type";

export interface TenantConfig {
  branding: {
    displayName: string;
    logoUrl: string;
    faviconUrl?: string;
  };

  theme: {
    primaryColor: string;
    secondaryColor?: string;
    fontFamily?: string;
    mode?: "light" | "dark";
  };

  layout: {
    type: "standard" | "magazine" | "minimal";
    header: "default" | "centered" | "compact";
    footer: "default" | "extended" | "minimal";
  };

  navigation: {
    style: string;
  };

  homepage: {
    sections: PageSection[];
  };

  features: {
    enableAds?: boolean;
    enablePersonalization?: boolean;
    enableComments?: boolean;
  };
}
