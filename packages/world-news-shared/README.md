# @world-news/shared

Shared TypeScript types package for News Engine.

## Install

```bash
npm install @world-news/shared
```

## Usage

```ts
import type { Article, TenantConfig, AppContextValue } from "@world-news/shared";

const data: Article = { ... };
```

## Exported types

All types from `src/types` are re-exported from `src/index.ts`.

## Build

```bash
npm run build:types
```

## Publish

```bash
npm login
npm publish --access public
```

If you need to publish for the first time under `@world-news`, make sure your npm org access is configured.
