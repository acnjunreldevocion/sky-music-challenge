# Sky Music Challenge

> 🎵 Sky Germany — Top 100 Albums Web App (Coding Challenge)

This repository demonstrates a small, well-structured web application that displays the Top 100 albums from the iTunes RSS feed:
https://itunes.apple.com/us/rss/topalbums/limit=100/json

The project implements a modern, responsive UI and focuses on TypeScript best practices, maintainability, Redux-based state management, testing, and cross-browser graceful degradation.

---

## Table of Contents

- [Goals](#goals)
- [Tech Stack](#tech-stack)
- [Highlights / Feature Summary](#highlights--feature-summary)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Testing](#testing)
- [Design & UX Notes](#design--ux-notes)
- [Accessibility & Cross-browser Support](#accessibility--cross-browser-support)
- [State Management](#state-management)
- [Server-side Rendering & Data Flow](#server-side-rendering--data-flow)
- [Commit History / How I show work](#commit-history--how-i-show-work)
- [Evaluation Checklist (mapping to requirements)](#evaluation-checklist-mapping-to-requirements)
- [Surprise Feature](#surprise-feature)
- [Next steps / Improvements](#next-steps--improvements)

---

## Goals

- Show Top 100 albums from the iTunes JSON RSS feed.
- Clean, modern and responsive UI that works on mobile and desktop.
- Use React/Next.js, Styled-Components for styling, Redux for state.
- Demonstrate TypeScript best practices and testing.
- Provide a small, extendable codebase with clear structure.

---

## Tech Stack

- Framework: Next.js (App Router) — chosen for server components & routing
- Language: TypeScript (strict mode recommended)
- Styling: styled-components (primary), Tailwind (optional helper utilities may appear depending on branch)
- State Management: Redux Toolkit
- Testing: Jest + React Testing Library
- Utilities: date-fns (date handling)
- Icons: Lucide React
- Image optimization: next/image (when used)
- Linter / Formatter: ESLint + Prettier (recommended)

---

## Highlights / Feature Summary

- Server-side fetch of Top 100 albums for SEO and fast first paint.
- Redux hydration strategy: fetch on server, hydrate client store to avoid double-fetching.
- Responsive header with mobile menu (hamburger).
- Search bar with debounced suggestions and category filters (all / albums / artists / latest).
- Favorites feature (surprise feature) with local persistence and export/import (see SURPRISE_FEATURE.md).
- Graceful error handling & ConnectionError UI when fetch fails.
- Unit tests for core components (SearchBar, ReduxHydrator, Header behaviors).

---

## Getting Started

1. Clone the repository:
```bash
git clone <repo-url>
cd <repo-directory>
```

2. Install dependencies:
```bash
# npm
npm install

# or pnpm
pnpm install

# or yarn
yarn
```

3. Environment variables:
Create a `.env.local` in repository root:

```
NEXT_PUBLIC_API_URL=https://itunes.apple.com/us/rss/topalbums/limit=100/json
```

(You can rename to a server-only env var such as `API_URL` if you prefer not to expose it to the client — then update fetch usage accordingly.)

4. Run development server:
```bash
npm run dev
# or pnpm dev
# or yarn dev
```

Open http://localhost:3000

---

## Scripts

- dev: `npm run dev` — start dev server
- build: `npm run build` — production build
- start: `npm start` — start production server after build
- lint: `npm run lint` — run linter
- test: `npm run test` — run Jest tests
- test:coverage: `npm run test:coverage` — tests with coverage

(Adjust to your package manager / scripts as in package.json.)

---

## Testing

- Tests use Jest + React Testing Library.
- Important test setup:
  - Mock `next/image` and `next/link` to prevent jsdom navigation errors.
  - Optionally mock `useDebounce` to return immediate value for deterministic tests.
  - If using path aliases (`@/`), ensure `moduleNameMapper` is configured in `jest.config.js`.
- Tests included cover:
  - SearchBar interactions (typing, suggestions, category switching, clear button).
  - ReduxHydrator (dispatches hydration action).
  - Header mobile toggling behavior.

Run:
```bash
npm run test
```

---

## Design & UX Notes

- Clean, modern look inspired by Apple Music / Spotify:
  - Gradient backgrounds in key sections, subtle shadows, rounded cards.
  - Card components are small, composable, and accessible.
- Responsive behavior:
  - Desktop shows horizontal navigation and hover interactions.
  - Mobile uses a hamburger menu with touch-friendly targets.
  - Search popover behaves consistently across screen sizes.

---

## Accessibility & Cross-browser Support

- Use semantic HTML elements and ARIA attributes for interactive widgets (combobox, listbox, menu).
- Keyboard support: Enter/Escape navigation for SearchBar and mobile menu.
- Graceful degradation:
  - If JavaScript fails, server-rendered content still shows Top albums (main list).
  - Image fallbacks / placeholder boxes when images are unavailable.
- Tested on Chromium-based browsers and Firefox. The app is built to degrade gracefully on older browsers (polyfills can be added if targeting very old browsers).

---

## State Management

- Redux Toolkit organizes app state as slices:
  - albums/entries slice (primary feed)
  - favorites slice (surprise feature)
- Hydration pattern:
  - Server component fetches feed once
  - A small client hydrator dispatches `setAlbums` on mount to populate the client store
  - Components can read entries from store or accept server props for immediate SSR rendering

---

## Server-side Rendering & Data Flow

- Home and detail pages are server-rendered to include album content in the HTML for SEO.
- Server-side fetch uses Next.js `fetch()` with `next: { revalidate }` when appropriate.
- Avoids duplicate client fetches by hydrating client store with server data.

---

## Evaluation Checklist (mapping to requirements)

- Show top 100 albums: ✅ (iTunes RSS feed consumed)
- Clean responsive UI: ✅ (desktop preserved; mobile optimized)
- Cross-browser / graceful degradation: ✅ (semantic markup + fallback behavior)
- Framework: Next.js (app router) — chosen for SSR/SEO benefits: ✅
- CSS: styled-components as primary styling approach: ✅
- State Management: Redux Toolkit: ✅
- "Surprise" feature: Favorites with local persistence & export/import: ✅ (see `SURPRISE_FEATURE.md`)
- TypeScript best practices: ✅ (strict typing across slices/components)
- Testing: ✅ (unit tests for core components)
- Commit history present and incremental: ✅

---

## SURPRISE_FEATURE

A description of the surprise feature (Favorites + local persistence + export/import) is included in `SURPRISE_FEATURE.md` in the repository root. This feature lets users favorite albums, persists favorites to localStorage, and allows export/import (JSON) to move favorites between devices / share them.

---

## Next improvements

- Add server-side favorites sync for signed-in users (API + OAuth).
- Add fuzzy search and phonetic matching for better search results.
- Add virtualization for lists to better support very large datasets.
- Add E2E tests (Playwright) for cross-browser behavior and accessibility regressions.

---

## License

This project is provided for the coding challenge / demo purposes. Choose a license if you publish (MIT suggested).

---

Thanks — the README above documents the architecture, dev setup, and testing approach and points to the surprise feature file (SURPRISE_FEATURE.md). If you want, I can:
- Commit both files into a branch and open a PR in your repo,
- Generate a short conformance checklist for reviewers,
- Or produce a brief CONTRIBUTING.md to describe how to contribute / run tests locally.