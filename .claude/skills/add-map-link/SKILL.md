---
name: add-map-link
description: Add a URL to the Geo Tokyo "Map Links" collection as a new src/content/maps/<id>.md entry — fetches the page title, description and Open Graph thumbnail, drafts the frontmatter, and by default marks it as planned for discussion at the next meetup. Use when the user shares a link (map, dataset, geo project, post, tweet) and says to add it, save it for later, queue it for the next meetup, or add it to map links.
---

# Add a map link

Turns one or more URLs into Map Links entries. Content format is documented in
`CONTENT.md` (section "maps/<id>.md — Map Links"); follow it and match the style of
existing files in `src/content/maps/`.

Handle each URL the user gave. Do the fetches for several URLs in parallel.

## 0. Read the user's options

Besides the URL, the user may give (in any phrasing, or as skill args):

- **A description** ("description: …", "say it's …", a sentence after the URL). When given,
  it replaces the Open Graph description: use their wording as-is, only fixing obvious typos
  and YAML quoting. Don't merge in the page's marketing text.
- **Who added it** ("added by Shane", "from @someone", "via Hiro"). Store it as `addedBy`.
  Match a first name to a full name in `src/content/organizers/*.md` when it's clearly one of
  them; otherwise keep the name exactly as the user wrote it. If the user didn't say, default
  to `git config user.name`.
- Optionally a meetup, tags or name — these override the defaults below.

If several URLs share one "added by", apply it to all of them; a description applies only to
the URL it was given with.

## 1. Fetch metadata and check for duplicates

```sh
node scripts/link-meta.mjs <url>
```

Prints JSON: `title`, `description`, `siteName`, `lang`, `image` (absolute og:image URL),
`finalUrl` after redirects, and `existing` — ids of entries that already link to this page.

- If `existing` is non-empty, stop for that URL and tell the user which entry already has it
  (offer to re-plan it for the next meetup instead).
- If the fetch failed (Node's fetch can't negotiate TLS with some older Japanese government
  servers, e.g. www.gsi.go.jp, even when `curl` works) or returned no title/description (common for X/Twitter, Instagram,
  Facebook and JS-only apps), use WebFetch on the URL to learn what the page is. If that also
  fails, ask the user for a one-line description rather than inventing one.

## 2. Pick the meetup

Default for "future discussion": the next upcoming meetup — the file in
`src/content/meetups/` with the earliest `date` that is today or later. Use its `number` as
`event`, its `date` as `date`, and `status: planned`.

If there is no upcoming meetup, omit `event`, set `date` to today (quoted ISO), and still set
`status: planned`. If the user names a meetup or says it was already discussed, use that
event number/date and `status: discussed`.

## 3. Write the entry

**id / filename**: short kebab-case slug of the project name, ASCII only
(e.g. `war-atlas`, `plateau-3d-tiles`). Make sure `src/content/maps/<id>.md` doesn't exist.

```yaml
---
name: 'Project Name'
url: 'https://example.com/'
description: "One sentence saying what it is and what's interesting about it."
tags: [visualization, japan]
date: '2026-09-17'
event: 8
status: planned
addedBy: 'Alastair Tse'
---
```

- **name**: the project's own name, not the page's SEO title. Strip suffixes like
  " | Site Name" or "- Home". For Japanese projects the existing style is
  `日本語名 (English Name)` when an English name is known.
- **url**: use `finalUrl` if the redirect was just canonicalisation (http→https, added
  slash); otherwise keep what the user gave.
- **description**: if the user supplied one, use it (see step 0). Otherwise rewrite the
  fetched description, don't paste marketing copy. One sentence, plain English,
  ≲ 25 words, concrete about what the map/data shows. See existing entries for tone.
- **tags**: one to three from exactly this list — `3d, dataset, basemap, illustration,
transit, visualization, japan, historical, api, tool`. Add `japan` when the subject is
  Japan or the project is Japanese.
- **addedBy**: from step 0; always set it.
- Always double-quote `name`, `url`, `description` and `addedBy`; escape inner `"` as `\"`.
- No body unless the user gave notes worth keeping.

## 4. Thumbnail

```sh
npm run thumbnails -- <id>
```

Downloads og:image to `static/images/maps/<id>.<ext>` and writes `image:` into the entry.
If it fails (no og:image, blocked site) or the image is a useless logo, take a screenshot
instead with the `set-map-thumbnail` skill (`node scripts/set-thumbnail.mjs <id> screenshot`).
If that can't produce anything useful either, leave `image` unset — the row falls back to
the host name — and tell the user.

Thumbnails display at most 120px wide, so shrink anything over ~200 KB or wider than 1200px
(macOS):

```sh
sips -Z 1200 static/images/maps/<id>.png   # resizes in place, keeps aspect ratio
```

Check the image looks like a real preview (not a generic logo or blank placeholder) by
reading it; if it's useless, delete the file and the `image:` line.

## 5. Verify and report

```sh
npx prettier --write src/content/maps/<id>.md
npm run build 2>&1 | grep -iE "\[content\]|error" || true
```

The build prints `[content]` warnings for unknown tags or missing dates — fix any for the
new entry. Don't commit unless asked.

Report to the user, per link: the id, name, description (noting if it was theirs or
drafted from the page), tags, who it's credited to, which meetup it's planned for, and
whether a thumbnail was saved (with size). Keep it short.
