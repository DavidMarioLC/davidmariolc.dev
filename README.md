# davidmariolc.dev

Portfolio and technical blog. Next.js 16 (App Router), Velite for content,
next-intl for English and Spanish, Tailwind 4 and shadcn/ui. Dark theme only.

## Getting started

The package manager is **pnpm**. Other lockfiles are not valid here.

```bash
pnpm install
cp .env.example .env.local   # then fill in the values
pnpm dev
```

`pnpm dev` runs Velite in watch mode alongside Next, so a change to a content
file shows up without restarting anything.

## Environment variables

| Variable | Required | What it is |
| :--- | :---: | :--- |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | yes | Cloudinary account that serves every content image |
| `NEXT_PUBLIC_SITE_URL` | yes | Absolute origin, used for canonicals, hreflang, sitemap, feed and OG images |

Both are read through `lib/env.ts`, which throws at module load if one is
missing. A missing variable stops the build instead of shipping a sitemap full
of relative URLs.

## Scripts

| Script | What it does |
| :--- | :--- |
| `pnpm dev` | Velite in watch mode plus the Next dev server |
| `pnpm build` | `velite --strict` then `next build` |
| `pnpm content` | Compiles content only |
| `pnpm check` | Lint, format check and message-catalogue parity |
| `pnpm fix` | Applies what `check` can fix |
| `pnpm typecheck` | `tsc --noEmit` |

`--strict` is not optional. Without it Velite prints a schema error, drops the
record and **exits 0**, so the site builds without the piece that failed.

## Writing content

Everything under `content/` is compiled by Velite into typed collections. The
language comes from the directory (`content/posts/en/…`), never from a
frontmatter field, and the slug comes from the filename. Use the same slug in
both languages so the language switcher can stay on the same page.

```
content/
  posts/{en,es}/*.mdx        blog posts
  projects/{en,es}/*.mdx     project pages
  series/{en,es}.yml         post series
  profile/{en,es}.yml        home page profile and intro
  achievements/{en,es}.yml   home page achievements
  community/{en,es}.yml      home page gallery
  books/{en,es}.yml          the books page
  setup/{en,es}.yml          the setup page
```

A post declares `draft: true` until it is ready. Drafts render in development
and disappear from the built site, the listing, the sitemap and the feed at
once.

Post bodies can use the components registered in
`components/mdx/mdx-components.tsx` — callouts, code blocks with diff notation,
a prediction challenge, a Sandpack playground, tables and images — without
importing them. A component that is not registered fails the build rather than
rendering as an unknown tag.

Images come from Cloudinary through `<PostImage>`. Markdown image syntax is
rejected on purpose: Velite resolves its `src` against the filesystem, so a
Cloudinary id fails with a confusing ENOENT.

## Interface strings

`messages/en.json` and `messages/es.json` must hold the same keys.
`pnpm check` fails when they drift.

## Brand logos

Technology and brand marks come from [svgl](https://svgl.app) through the
shadcn CLI, and are registered in `lib/logo-registry.ts`:

```bash
pnpm dlx shadcn@latest add @svgl/typescript
```

Interface icons come from `lucide-react`. Files in `components/ui/svgs/` are
generated; do not edit them by hand.
