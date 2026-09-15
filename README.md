# Geo Tokyo site

Website for Geo Tokyo, an irregular Tokyo mapping meetup. Built with SvelteKit 5,
Tailwind CSS 4 and mdsvex. Fully prerendered to static HTML and served by nginx
from a Docker image, hosted on Coolify.

## Develop

```sh
pnpm install
pnpm dev        # http://localhost:5173
pnpm check      # type-check
pnpm lint       # prettier + eslint
pnpm build      # prerender the site into ./build
pnpm preview    # serve ./build locally on http://localhost:4173
```

## Deploy (Coolify)

Two build packs are supported; pick one in Coolify.

**Dockerfile** (recommended): builds the site and serves `./build` with nginx.

1. New resource → Application → pick this Git repository and the `main` branch.
2. Build pack: **Dockerfile** (leave the Dockerfile location as `/Dockerfile`).
3. Port: `80`.
4. Build argument `SITE_ORIGIN` = the public URL, e.g. `https://geotokyo.example`.
   It is only used for absolute links in the RSS feed.
5. Set the domain, deploy, and enable automatic deploys on push if you want
   content edits to go live on their own.

**Nixpacks**: uses `nixpacks.toml`, which installs with pnpm, runs `pnpm build`,
and starts `pnpm start` (the `serve` package serving `./build`).

1. Build pack: **Nixpacks**. Port: `3000`.
2. Environment variables: `SITE_ORIGIN` (build time) and optionally `PORT`.
3. Deploy as above.

To test the image locally:

```sh
docker build --build-arg SITE_ORIGIN=https://geotokyo.example -t geotokyo-site .
docker run --rm -p 8080:80 geotokyo-site   # http://localhost:8080
```

## Content

Events, map links, organizers and site settings are Markdown files under
`src/content/`; images live in `static/images/`. See [CONTENT.md](./CONTENT.md)
for the frontmatter fields and where each piece renders.

## Layout

- `src/routes/` — pages: `/`, `/meetups`, `/meetups/[slug]`, `/maps` (Map Links), plus
  `/maps.json` and `/maps.xml` exports.
- `src/lib/components/` — reusable UI components.
- `src/lib/content/` — content loader (`import.meta.glob` over the Markdown files),
  types and date/URL formatting helpers.
- `src/routes/layout.css` — Tailwind theme tokens from the design handoff.

## Not wired yet

- Newsletter signup shows an inline confirmation but does not call a provider.
- "Submit a project" opens a pre-filled GitHub issue.
