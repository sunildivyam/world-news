export const NEWSENGINE_API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "https://news-engine-seven.vercel.app";

export const newsEngineBaseApiUrl =
  process.env.NEWSENGINE_API_URL || NEWSENGINE_API_URL;
