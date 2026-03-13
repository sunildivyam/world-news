import { GeoContext } from "./GeoContext.interface";

export interface UserContext {
  language?: string;
  sessionId?: string;
  interests?: string[];
  keywords?: string[];
  geo?: GeoContext;
}
