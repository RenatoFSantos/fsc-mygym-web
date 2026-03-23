# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`mygym-web` — the frontend for a gym workout management app, built with Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui. It consumes `mygym-api` (a Fastify REST API).

## Commands

All commands are run from this directory (`mygym-web/`).

```bash
# Development server
pnpm dev

# Build
pnpm build

# Lint
pnpm lint

# Add a shadcn/ui component (e.g. "dialog")
pnpm dlx shadcn@latest add <component>

# Regenerate Orval API client (run after API changes)
pnpm dlx orval
```

## Architecture

- `app/` — Next.js App Router pages and layouts. Prefix private folders with `_` (e.g. `app/_lib/`).
- `app/_lib/auth-client.ts` — BetterAuth client singleton (`authClient`). Import this wherever session checks or auth actions are needed.
- `app/globals.css` — Tailwind CSS v4 theme variables (CSS custom properties). All color tokens live here; never use hardcoded Tailwind color classes.
- `components/ui/` — shadcn/ui component overrides. Install new components with the `shadcn` CLI, then customise here if needed.
- `lib/api/generated/` — Orval-generated API functions and TanStack Query hooks. Regenerate with `npx orval` when the API schema changes.

## Key Conventions

See `.claude/rules/` for detailed rules. Summary:

**Routing & auth**: No middleware for auth. Use `authClient.useSession()` on the page itself. Protected pages redirect to `/auth`; the auth page redirects to `/` when already logged in.

**Data fetching**: Prefer Server Components with `fetch`. For client-side fetching, use hooks from `@/lib/api/rc-generated`. Use functions from `@/app/_lib/api/fetch-generated` for server-side fetching. Pass server data as `initialData` to TanStack Query hooks in Client Components.

**Mutations**: Use the synchronous `mutate` (not `mutateAsync`) variant from Orval hooks. Handle success/error via `onSuccess`/`onError` options — never try/catch.

**authClient calls**: Always destructure `error` from the result instead of wrapping in try/catch.

**Colors**: Only use theme tokens defined in `app/globals.css` (e.g. `bg-primary`, `text-foreground`, `border-border`). Never use hardcoded Tailwind colors or arbitrary color values.

**Components**: One component per file. Always use shadcn/ui components when available (check Context7 docs before creating anything custom). Always use `Button` from `@/components/ui/button`.

**Forms**: React Hook Form + Zod + shadcn/ui `Form` component.

**Dates**: Use `dayjs` for all date manipulation and formatting.

**Styling**: kebab-case for file/folder names. No code comments. No `npm run dev` to verify changes.

## Environment

Required env variable:
- `NEXT_PUBLIC_API_URL` — base URL of the `mygym-api` backend (used by `authClient`)
