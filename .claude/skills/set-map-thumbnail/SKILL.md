---
name: set-map-thumbnail
description: Set or replace the thumbnail image of a Geo Tokyo Map Links entry (src/content/maps/<id>.md) by hand — from a screenshot of the page, a local image file, an image URL, or whatever is on the macOS clipboard. Use when an entry has no thumbnail (og:image missing or blocked, e.g. X/Twitter, Instagram, JS-only map apps), the auto-fetched one is a useless logo, or the user says "take a screenshot for …", "use this image for …", "replace the thumbnail", "I've copied a screenshot".
---

# Set a map link thumbnail

All the mechanics are in one script:

```sh
node scripts/set-thumbnail.mjs <id> <source> [options]
```

| source          | what it does                                                              |
| --------------- | ------------------------------------------------------------------------- |
| `screenshot`    | Headless Chrome (Playwright) captures the entry's `url` at 1200×800       |
| `clipboard`     | Uses the image on the macOS clipboard (e.g. after ⌃⇧⌘4)                   |
| `/path/to/file` | Copies a local png/jpg/webp/gif/svg (e.g. `~/Desktop/Screenshot….png`)    |
| `https://…`     | Downloads an image URL (a page URL errors — use `screenshot --url=` then) |

Screenshot options: `--url=<page>` (capture a different page than the entry's url),
`--wait=<ms>` (default 4000; raise to 8000+ for heavy WebGL/tile maps),
`--selector=<css>` (capture one element, e.g. the map canvas), `--dark`.

The script shrinks png/jpg to ≤1200px wide, converts screenshots/clipboard images to JPEG,
saves to `static/images/maps/<id>.<ext>`, updates `image:` in the entry, and deletes the
previous `/images/maps/<id>.*` file if the extension changed. It prints the final path,
dimensions and size.

## Steps

1. **Find the entry.** The user may give an id, a name or a URL. Resolve it to a file in
   `src/content/maps/` (`grep -l` on `name:`/`url:`). If ambiguous, ask.
2. **Pick the source.**
   - User attached or named a file → that path. Look in `~/Desktop` / `~/Downloads` for the
     newest `Screenshot*.png` if they say "the screenshot I just took".
   - User says they copied an image → `clipboard`.
   - Otherwise → `screenshot`.
3. **Run the script.** Thumbnails display at 3:2 (120px wide) on desktop and 1:1 (64px) on
   mobile, so a viewport screenshot works; prefer the map itself over headers or cookie
   banners — use `--selector` (e.g. `canvas`, `.maplibregl-map`, `#map`) when the page has
   lots of chrome around the map.
4. **Look at the result.** Read the saved image. Retake if it's blank, still loading, a
   cookie/consent wall, a login page or a CAPTCHA (try a longer `--wait`, a `--selector`, or
   a more specific `--url`). If screenshots can't produce something useful (sites like X
   block headless browsers), tell the user and ask them to take one and copy it or drop the
   file path in the chat.
5. **Report** the path, dimensions and size. Don't commit unless asked.

If `screenshot` fails to launch a browser, Google Chrome isn't installed: run
`npx playwright install chromium` once and retry.
