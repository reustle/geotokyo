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
├── events/*.md          one file per meetup (filename = URL slug: /events/<slug>)
└── projects/*.md           one file per project
static/images/
├── events/<slug>/       covers and photos
├── projects/               project thumbnails
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
projectsIntro: Projects we talked about, and ones we're planning to. # /projects headline
projectsBlurb: Tools, datasets, maps and papers… # /projects intro
nav:
  - { label: Events, href: /events }
  - { label: Projects, href: /projects }
  - { label: Subscribe, href: '#subscribe' }
---
About text (Markdown). Not rendered anywhere yet; kept for future use.
```

## events/<slug>.md

```yaml
---
number: 9 # required, used for "#9" labels and ordering
title: 'Geo Tokyo Meetup : Summer 2026' # quote titles containing ":"
shortName: Summer 2026 # optional; used for upcoming events on /projects
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
cover: /images/events/summer-2026/cover.svg # optional logo shown in the cover block
speakers: # optional
  - name: Speaker One
    role: Cartographer
    talk: Styling a basemap so people actually read it
    photo: /images/events/summer-2026/speaker-one.jpg
    note: '[placeholder]' # small grey suffix after the name
schedule: # optional
  - { time: '18:00', what: 'Doors, drinks, maps on the wall' }
photos: # optional; first photo is shown large
  - { src: /images/events/summer-2026/01.jpg, alt: Room shot }
---
Description shown in the event sidebar (Markdown).
```

## projects/<id>.md

```yaml
---
name: Protomaps
url: https://protomaps.com # the host is derived from this
description: Single-file PMTiles basemaps you can host anywhere.
tag: tiles # free text; becomes a filter chip on /projects
event: 8 # event number it was shared at (or planned for)
status: discussed # discussed | planned (defaults from the event date)
image: /images/projects/protomaps.png # optional thumbnail (3:2 at 120px wide on desktop, 1:1 at 64px on mobile)
date: '2026-05-27' # optional; defaults to the event date, used for ordering
---
Optional longer notes (Markdown). Not rendered yet.
```

Projects are also exported at `/projects.json` and as RSS at `/projects.xml`.

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

| Content     | Home                           | /events       | /events/[slug]              | /projects       |
| ----------- | ------------------------------ | ------------- | --------------------------- | --------------- |
| next event  | hero                           | Upcoming grid | full page, "Next one" aside | event label     |
| past events | 3 most recent + "earlier" card | Past grid     | full page                   | event label     |
| projects    | 6 most recent                  |               | projects for that event     | table + filters |
| organizers  | footer                         | footer        | footer                      | footer          |

## Components

Reusable pieces live in `src/lib/components/` and are exported from
`src/lib/components/index.ts`: `SiteHeader`, `SiteFooter`, `PageShell`, `Contour`,
`Wordmark`, `SectionLabel`, `CtaLink`, `EventCover`, `EventCard`, `EventGrid`,
`ProjectRow`, `ProjectCompactRow`, `ProjectTable`, `ProjectThumb`, `FilterChips`,
`NewsletterForm`, `SpeakerRow`, `ScheduleRow`, `PhotoGrid`, `MetaList`.
Design tokens (colours, fonts, the single 720px breakpoint) are defined in
`src/routes/layout.css` under `@theme`.
