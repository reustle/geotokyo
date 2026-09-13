# Geo Tokyo site

Website for Geo Tokyo, an irregular Tokyo mapping meetup. Built with SvelteKit 5,
Tailwind CSS 4 and mdsvex, deployed to Cloudflare Workers.

## Develop

```sh
pnpm install
pnpm dev        # http://localhost:5173
pnpm check      # type-check
pnpm lint       # prettier + eslint
pnpm build      # prerender the site into .svelte-kit/cloudflare
pnpm preview    # run the built worker locally
```

## Content

Events, links, organizers and site settings are Markdown files under
`src/content/`; images live in `static/images/`. See [CONTENT.md](./CONTENT.md)
for the frontmatter fields and where each piece renders.

## Layout

- `src/routes/` — pages: `/`, `/events`, `/events/[slug]`, `/links`, plus
  `/links.json` and `/links.xml` exports.
- `src/lib/components/` — reusable UI components.
- `src/lib/content/` — content loader (`import.meta.glob` over the Markdown files),
  types and date/URL formatting helpers.
- `src/routes/layout.css` — Tailwind theme tokens from the design handoff.

## Not wired yet

- Newsletter signup shows an inline confirmation but does not call a provider.
- "Submit a link" opens a pre-filled GitHub issue.
