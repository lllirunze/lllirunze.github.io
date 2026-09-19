# Repository Guidelines

## Project Structure & Module Organization

This is an Astro 5 static blog. Routes live in `src/pages/`, shared UI in
`src/components/`, and page shells in `src/layouts/`. Posts are
Markdown files under `src/content/posts/`; collection schemas are defined in
`src/content/config.ts`. Put reusable logic in `src/utils/`, site constants in
`src/constants/`, translations in `src/i18n/`, and global or feature styles in
`src/styles/`. Imported and optimized images belong in `src/assets/`; files that
must retain their public paths belong in `public/`. Build utilities live in
`scripts/`.

## Build, Test, and Development Commands

Use pnpm 9, enforced through `preinstall`.

- `pnpm install` installs dependencies and Chromium for Mermaid rendering.
- `pnpm dev` starts Astro's development server at `http://localhost:4321`.
- `pnpm build` creates `dist/` and builds the Pagefind search index.
- `pnpm preview` serves the production build locally.
- `pnpm type-check` runs strict TypeScript declaration checks.
- `pnpm lint` applies Biome lint fixes and import organization to `src/`.
- `pnpm format` formats files under `src/`.
- `pnpm new-post my-post` scaffolds `src/content/posts/my-post.md`.

## Coding Style & Naming Conventions

Follow `biome.json`: two-space indentation, 80-character lines, single quotes,
trailing commas, and semicolons only when required. Keep TypeScript strict and
prefer configured aliases such as `@components/*` and `@utils/*` over long
relative imports. Name Astro and framework components in PascalCase
(`PostCard.astro`), utilities in kebab-case (`date-utils.ts`), and post slugs in
lowercase kebab-case. Preserve existing conventions in `src/config.ts`, which is
intentionally excluded from Biome formatting.

## Testing Guidelines

No automated test suite or coverage threshold is configured. Before
submitting changes, run `pnpm type-check`, `pnpm lint`, and `pnpm build`. Preview
UI changes at desktop and mobile widths, checking navigation, light/dark themes,
Markdown rendering, and search where relevant. A successful production build is
the minimum regression check.

## Commit & Pull Request Guidelines

Recent history uses concise, imperative subjects and often
Conventional Commit prefixes such as `feat:`, `fix:`, and `refactor:`. Prefer
that format, for example `fix: normalize archive tag links`, and keep each
commit focused. Pull requests should explain the motivation and user-visible
effect, list validation commands, link related issues, and include before/after
screenshots for visual changes. Call out configuration, content-schema, or
dependency changes explicitly.

## Content & Configuration Tips

Customize site behavior in `src/config.ts` and deployment metadata in
`astro.config.mjs` or `vercel.json`. Follow the existing frontmatter schema for
new posts, including `title`, `published`, `description`, `tags`, `category`, and
`draft`. Never commit credentials; use environment variables and
document any newly required variable in the pull request.
