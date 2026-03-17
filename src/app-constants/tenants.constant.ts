import { Tenant } from "@/types/Tenant.interface";

export const tenants: Tenant[] = [
  {
    id: "globalnews",
    name: "Global News",
    primaryLanguage: "en",
    primaryCountry: "us",
    createdDate: new Date(),
    updatedDate: new Date(),
    isActive: true,
    domain: "globalnews.com",
    settings: {
      branding: {
        displayName: "Global News",
        logoUrl:
          "https://statics.moonshot.cn/kimi-web-seo/assets/kimi-logo-CegIMkbU.png",
        faviconUrl: "",
      },

      theme: {
        primaryColor: "#ff5511",
        secondaryColor: "#1111ff",
        fontFamily: "",
        mode: "light",
      },

      layout: {
        type: "standard", // | "magazine" | "minimal";
        header: "default", // | "centered" | "compact";
        footer: "default", // | "extended" | "minimal";
      },

      navigation: {
        style: "standard",
      },

      homepage: {
        sections: [
          { type: "hero" },
          { type: "trending" },
          { type: "category", config: { category: "technology" } },
          { type: "latest" },
        ],
      },

      features: {
        enableAds: true,
        enablePersonalization: true,
        enableComments: true,
      },
    },
  },
  {
    id: "globalnewsA",
    name: "Global News A",
    primaryLanguage: "hi",
    primaryCountry: "in",
    createdDate: new Date(),
    updatedDate: new Date(),
    isActive: true,
    domain: "globalnewsA.com",
    settings: {
      branding: {
        displayName: "Global News A",
        logoUrl:
          "https://rapidapi-prod-fe-static.s3.amazonaws.com/theming/Rapid_Logo_Primary.png",
        faviconUrl: "",
      },

      theme: {
        primaryColor: "#0066eb",
        secondaryColor: "#00c60a",
        fontFamily: "",
        mode: "dark",
      },

      layout: {
        type: "magazine", // | "magazine" | "minimal";
        header: "centered", // | "centered" | "compact";
        footer: "minimal", // | "extended" | "minimal";
      },

      navigation: {
        style: "standard",
      },

      homepage: {
        sections: [
          { type: "trending" },
          { type: "hero" },
          { type: "category", config: { category: "politics" } },
          { type: "latest" },
        ],
      },

      features: {
        enableAds: true,
        enablePersonalization: true,
        enableComments: true,
      },
    },
  },
  {
    id: "annuadvent",
    name: "AnnuAdvent",
    primaryLanguage: "hi",
    primaryCountry: "in",
    createdDate: new Date(),
    updatedDate: new Date(),
    isActive: true,
    domain: "annuadvent.com",
    settings: {
      branding: {
        displayName: "AnnuAdvent",
        logoUrl:
          "https://res.cloudinary.com/du3bpaesk/image/upload/v1773734733/logo-a-70-square_qjmvgm.png",
        faviconUrl: "",
      },

      theme: {
        primaryColor: "#0066eb",
        secondaryColor: "#00c60a",
        fontFamily: "",
        mode: "light",
      },

      layout: {
        type: "magazine", // | "magazine" | "minimal";
        header: "centered", // | "centered" | "compact";
        footer: "minimal", // | "extended" | "minimal";
      },

      navigation: {
        style: "standard",
      },

      homepage: {
        sections: [
          { type: "trending" },
          { type: "hero" },
          { type: "category", config: { category: "politics" } },
          { type: "latest" },
        ],
      },

      features: {
        enableAds: true,
        enablePersonalization: true,
        enableComments: true,
      },
    },
  },
];

export const DEFAULT_TENANT = tenants[0];
