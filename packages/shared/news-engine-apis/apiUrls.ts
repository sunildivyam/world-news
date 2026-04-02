export const NEWSENGINE_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "https://news-engine-seven.vercel.app";

export const newsEngineBaseApiUrl = process.env.NEWSENGINE_BASE || NEWSENGINE_BASE;
