export type PageSection =
  | { type: "hero"; config?: any }
  | { type: "trending"; config?: any }
  | { type: "latest"; config?: any }
  | { type: "category"; config: { category: string } }
  | { type: "ads"; config?: any };
