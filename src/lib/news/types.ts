export interface UserContext {
  sessionId: string;
  country: string;
  language: string;
  region?: string;
  city?: string;
  ip?: string;
  keywords?: string[];
  interests?: string[]; // future: behavior-based
}
