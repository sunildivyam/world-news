export const CONTENTENGINE_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:11434"
    : "https://news-engine-seven.vercel.app";

export const contentEngineBaseApiUrl =
  process.env.CONTENTENGINE_BASE || CONTENTENGINE_BASE;
