# Managing content

All site content lives in Markdown files under `src/content/`. Each file has YAML
frontmatter (the block between `---` lines) plus an optional Markdown body.
Images go in `static/images/` and are referenced by absolute path (`/images/...`).

The site is prerendered, so after editing content run `pnpm build` and deploy.
"Next meetup" is whichever event has the earliest date that is today or later,
evaluated at build time, so rebuild after an event has passed.

Tip: quote any YAML value that contains `#`, `:` or starts with `[`, e.g.
`description: "Speaker project from #7"`.

```
src/content/
├── site.md              site-wide settings + about text
├── organizers/*.md      one file per organizer
├── meetups/*.md         one file per meetup (filename = URL slug: /meetups/<slug>)
└── maps/*.md               one file per Japanese map / geo project (the "Japanese Maps" collection)
static/images/
├── meetups/<slug>/       covers and photos
├── maps/                   thumbnails for Japanese map entries
└── organizers/          headshots
```

## site.md

```yaml
---
title: Geo Tokyo
tagline: Tokyo mapping meetup.<br>Irregular since 2025. # footer, HTML allowed
coordinates: 35.6595°N 139.7005°E
lumaUrl: https://luma.com/tokyotech
githubUrl: https://github.com/liquidx/geotokyo-site
newsletterBlurb: One email when the next meetup is scheduled…
mapsIntro: Recent interesting Japanese maps # /maps headline
mapsBlurb: Basemaps, open datasets, 3D city models… # /maps intro
nav:
  - { label: Meetups, href: /meetups }
  - { label: Japanese Maps, short: JP Maps, href: /maps }
---
About text (Markdown). Not rendered anywhere yet; kept for future use.
```

## meetups/<slug>.md

```yaml
---
number: 9 # required, used for "#9" labels and ordering
title: 'Geo Tokyo Meetup : Summer 2026' # quote titles containing ":"
subtitle: Summer 2026 # optional; second line under the title (hero, cards, event page)
date: '2026-09-17' # required, quoted ISO date
startTime: '18:00' # optional
endTime: '20:00' # optional
venue: FabCafe Tokyo # required
city: Shibuya, Tokyo # optional; first part shown in hero
hosts: [Alastair Tse, Shane Reustle] # optional
color: '#f9a03f' # optional cover colour (default: accent red)
ink: '#1e1c19' # optional text colour on the cover
highlight: One-line summary for cards. # optional
lumaUrl: https://luma.com/xxxx # optional; enables the RSVP button
cover: /images/meetups/summer-2026/cover.svg # optional logo shown in the cover block
speakers: # optional
  - name: Speaker One
    role: Cartographer
    talk: Styling a basemap so people actually read it
    photo: /images/meetups/summer-2026/speaker-one.jpg
    note: '[placeholder]' # small grey suffix after the name
schedule: # optional
  - { time: '18:00', what: 'Doors, drinks, maps on the wall' }
photos: # optional; first photo is shown large
  - { src: /images/meetups/summer-2026/01.jpg, alt: Room shot }
projects: # optional; projects presented at this event (any origin, not only Japanese)
  - name: Protomaps
    url: https://protomaps.com # optional
    by: Speaker One # optional
    description: Single-file PMTiles basemaps you can host anywhere. # optional
maps: [gsi-tiles, plateau] # optional; ids of Japanese map entries discussed at this event
---
Description shown in the event sidebar (Markdown).
```

## maps/<id>.md — Japanese Maps

One file per Japanese mapping / geo project, dataset, basemap, 3D model, map or post
that the group has found or talked about. This is the collection behind the
"Japanese Maps" nav item and the home-page feed.

```yaml
---
name: 国土数値情報 (National Land Numerical Information)
url: https://nlftp.mlit.go.jp/ksj/ # the host is derived from this
description: MLIT's open GIS datasets for Japan.
tags: [data, open data] # one or more; each becomes a filter chip on /maps (`tag: data` also works)
event: 8 # optional; event number where it was first shared (or is planned for)
status: discussed # discussed | planned (defaults from the event date)
image: /images/maps/kokudo-suuchi.png # optional thumbnail (3:2 at 120px wide on desktop, 1:1 at 64px on mobile)
date: '2026-05-27' # optional; defaults to the event date, used for ordering
---
Optional longer notes (Markdown). Not rendered yet.
```

An entry shows up on an event page when its `event` matches, or when the event
lists its id under `maps:`. That lets one entry be discussed at several meetups.

Entries are also exported at `/maps.json` and as RSS at `/maps.xml`.

## organizers/<slug>.md

```yaml
---
name: Alastair Tse
role: Independent Researcher, Software Engineer
order: 1 # optional sort order
photo: /images/organizers/alastair.jpg # optional, not rendered yet
---
```

## Where things render

| Content          | Home                           | /meetups      | /meetups/[slug]             | /maps          |
| ---------------- | ------------------------------ | ------------- | --------------------------- | -------------- |
| next event       | hero                           | Upcoming grid | full page, "Next one" aside | event label    |
| past events      | 3 most recent + "earlier" card | Past grid     | full page                   | event label    |
| Japanese maps    | 6 most recent                  |               | "Japanese maps discussed"   | list + filters |
| event `projects` |                                |               | "Projects presented"        |                |
| organizers       | footer                         | footer        | footer                      | footer         |

## Components

Reusable pieces live in `src/lib/components/` and are exported from
`src/lib/components/index.ts`: `SiteHeader`, `SiteFooter`, `PageShell`, `Contour`,
`Wordmark`, `SectionLabel`, `CtaLink`, `EventCover`, `EventCard`, `EventGrid`,
`ProjectRow`, `ProjectCompactRow`, `ProjectTable`, `ProjectThumb`, `FilterChips`,
`NewsletterForm`, `SpeakerRow`, `ScheduleRow`, `PhotoGrid`, `MetaList`.
Design tokens (colours, fonts, the single 720px breakpoint) are defined in
`src/routes/layout.css` under `@theme`.
