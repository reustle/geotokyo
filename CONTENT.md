# Managing content

All site content lives in Markdown files under `src/content/`. Each file has YAML
frontmatter (the block between `---` lines) plus an optional Markdown body.
Images go in `static/images/` and are referenced by absolute path (`/images/...`).

The site is prerendered, so content changes go live on the next build and deploy
(automatic if Coolify's deploy-on-push is enabled).
"Next meetup" is whichever event has the earliest date that is today or later,
evaluated at build time, so rebuild after an event has passed.

Tip: quote any YAML value that contains `#`, `:` or starts with `[`, e.g.
`description: "Speaker project from #7"`.

```
src/content/
├── site.md              site-wide settings + about text
├── organizers/*.md      one file per organizer
├── meetups/*.md         one file per meetup, named yyyy-mm.md (filename = URL slug)
└── maps/*.md               one file per map link: map, dataset, geo project or post (the "Map Links" collection)
static/images/
├── meetups/<slug>/       covers and photos
├── maps/                   thumbnails for map link entries
└── organizers/          headshots
```

## site.md

```yaml
---
title: Geo Tokyo
description: Geo Tokyo is an irregular Tokyo meetup for map enthusiasts… # page description + social preview text
tagline: Tokyo mapping meetup.<br>Irregular since 2025. # footer, HTML allowed
coordinates: 35.6595°N 139.7005°E
lumaUrl: https://luma.com/tokyotech
githubUrl: https://github.com/liquidx/geotokyo-site
newsletterBlurb: One email when the next meetup is scheduled…
mapsIntro: Interesting Maps and Data # /maps headline
mapsBlurb: Maps, Datasets, Cartography and posts from Japan's Geo community and around the world. # /maps intro
nav:
  - { label: Meetups, href: /meetups }
  - { label: Map Links, href: /maps } # `short:` optionally sets a narrow-screen label
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
highlight: One-line summary for cards. # optional; also shown in the event page sidebar
lumaUrl: https://luma.com/xxxx # optional; enables the RSVP button
meetupUrl: https://www.meetup.com/geotokyo/events/xxxx/ # optional; older events hosted on Meetup.com
cover: /images/meetups/2026-09/cover.svg # optional logo shown in the cover block
speakers: # optional
  - name: Speaker One
    role: Cartographer
    talk: Styling a basemap so people actually read it
    photo: /images/meetups/2026-09/speaker-one.jpg
    note: '[placeholder]' # small grey suffix after the name
schedule: # optional
  - { time: '18:00', what: 'Doors, drinks, maps on the wall' }
photos: # optional; first photo is shown large
  - { src: /images/meetups/2026-09/01.jpg, alt: Room shot }
projects: # optional; projects presented at this event (any origin, not only Japanese)
  - name: Protomaps
    url: https://protomaps.com # optional
    by: Speaker One # optional
    description: Single-file PMTiles basemaps you can host anywhere. # optional
maps: [gsi-tiles, plateau] # optional; ids of map link entries discussed at this event
---
Notes (Markdown). Shown in a "Notes" section on the event page, above the projects; omitted when empty.
```

## maps/<id>.md — Map Links

One file per map, dataset, geo project, example, basemap, 3D model or post
that the group has found or talked about. This is the collection behind the
"Map Links" nav item and the home-page feed.

```yaml
---
name: 国土数値情報 (National Land Numerical Information)
url: https://nlftp.mlit.go.jp/ksj/ # the host is derived from this
description: MLIT's open GIS datasets for Japan.
tags: [dataset, japan] # one or more of: 3d, dataset, basemap, illustration, transit, visualization, japan, historical, api, tool
date: '2026-05-27' # the day the link was added; also orders the list. If omitted, taken from the event's date
event: 8 # optional; event number where it was first shared (or is planned for)
status: discussed # optional; discussed | planned. Unset until the link is planned for a meetup
addedBy: Alastair Tse # optional; who added the link (exported in /maps.json, not rendered yet)
image: /images/maps/kokudo-suuchi.png # optional thumbnail (3:2 at 120px wide on desktop, 1:1 at 64px on mobile)
---
Optional longer notes (Markdown). Not rendered yet.
```

A link starts with no `event` and no `status`: it is just something worth keeping. Those two
keys are set later, when it goes on a meetup's list and after it has been shown.

### Adding a link with Claude Code

Three skills cover the life of a link:

| skill                | what it does                                                             |
| -------------------- | ------------------------------------------------------------------------ |
| `add-map-link`       | URL → new entry with title, description and thumbnail; no event or status |
| `add-map-to-event`   | Sets `event:` (next meetup by default) and `status: planned`              |
| `set-map-discussed`  | Sets `status: discussed` once it has been shown                           |

Give Claude Code a URL ("add this to map links") and `add-map-link` fetches the title,
description and thumbnail and runs the build to check the entry. You can give it your own
description to use instead of the page's, and say who added it (defaults to your git
`user.name`), e.g. "add https://example.com, description: …, added by Shane Reustle".
`npm run link-meta -- <url>` prints the metadata it starts from.

Later, "let's bring these up next time" runs `add-map-to-event`, and "we covered these"
runs `set-map-discussed`. Both wrap one script, which is also usable directly:

```sh
npm run map-status -- --next-event                        # the next upcoming meetup, as JSON
npm run map-status -- train-jazz --event=next --status=planned
npm run map-status -- train-jazz world-train-map --status=discussed
npm run map-status -- train-jazz --event=none --status=none   # back to unplanned
```

### Thumbnails

`image:` is a path under `static/`, usually `/images/maps/<id>.<ext>`. Without one, the
row shows the link's host as a placeholder. To pull Open Graph images automatically:

```sh
npm run thumbnails                    # every entry without an image
npm run thumbnails -- plateau kochizu # only these ids
npm run thumbnails -- --dry-run       # report what would be fetched
npm run thumbnails -- --force         # refetch even if image is set
```

The script reads each entry's `url`, takes `og:image` (or `twitter:image`), saves it to
`static/images/maps/` and writes `image:` into the frontmatter. Sites that hide
Open Graph tags from scripts (X/Twitter, Instagram, Facebook) will fail; add those by hand.
Images are saved as-is, so check the file sizes and resize large ones before committing.

To set a thumbnail by hand (or with the `set-map-thumbnail` Claude Code skill):

```sh
npm run set-thumbnail -- <id> screenshot             # headless Chrome screenshot of the entry's url
npm run set-thumbnail -- <id> screenshot --wait=8000 --selector=canvas
npm run set-thumbnail -- <id> clipboard              # image you copied (e.g. ⌃⇧⌘4)
npm run set-thumbnail -- <id> ~/Desktop/shot.png     # local file
npm run set-thumbnail -- <id> https://…/image.jpg    # image URL
```

It resizes to ≤1200px wide, saves JPEG for screenshots, and updates `image:` for you.
Or do it manually: put the file at `static/images/maps/<id>.<ext>` and add
`image: /images/maps/<id>.<ext>` to the entry.

Tags are limited to the ten above; each becomes a filter chip on /maps, and the build warns about any other tag.

Entries are sorted newest first by `date`. Give every entry a date; entries with an
`event` fall back to that meetup's date, and the build warns about any entry that has
neither.

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
| map links        | 6 most recent                  |               | "Map links discussed"       | list + filters |
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
