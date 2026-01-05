# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev       # Start dev server at localhost:4321
npm run build     # Build production site to ./dist/
npm run preview   # Preview production build locally
npm run astro check  # Run TypeScript type checking
```

## Architecture

This is an **Astro 5** static site with **Tailwind CSS 4**.

### Tech Stack
- **Astro 5.16.6** - Static site generator with islands architecture
- **Tailwind CSS 4.1.18** - Integrated via @tailwindcss/vite plugin
- **TypeScript** - Strict mode enabled

### File-Based Routing
Pages in `src/pages/` automatically become routes:
- `src/pages/index.astro` → `/`
- `src/pages/about.astro` → `/about`
- `src/pages/blog/[slug].astro` → `/blog/:slug` (dynamic routes)

### Key Directories
- `src/pages/` - Routes (each .astro file = URL path)
- `src/components/` - Reusable Astro components
- `src/layouts/` - Page templates using `<slot />` for content
- `src/styles/global.css` - Tailwind imports (`@import "tailwindcss"`)
- `public/` - Static assets served at root

### Adding API Endpoints
Create `.ts` or `.js` files in `src/pages/api/` for server endpoints:
```typescript
// src/pages/api/example.ts
export async function GET() {
  return new Response(JSON.stringify({ data: "value" }));
}
```

## Configuration Files
- `astro.config.mjs` - Astro and Vite plugin configuration
- `tsconfig.json` - TypeScript settings (extends astro/tsconfigs/strict)
