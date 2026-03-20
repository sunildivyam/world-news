"use client";
import { AppContextValue } from "@worldnews/shared";
import { createContext, ReactNode } from "react";

export const AppContext = createContext<AppContextValue | null>(null);

export function AppContextProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: AppContextValue;
}): ReactNode {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
