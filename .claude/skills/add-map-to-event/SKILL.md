---
name: add-map-to-event
description: Plan an existing Geo Tokyo Map Links entry for a meetup — sets `event:` to the next upcoming meetup (or one the user names) and `status: planned` in src/content/maps/<id>.md. Use when the user says to bring a link up at the next meetup, queue/plan/schedule it for an event, tag it to meetup #N, or add it to the agenda. For marking one as already shown use set-map-discussed; for adding a brand-new URL use add-map-link.
---

# Plan a map link for a meetup

Tags one or more existing entries in `src/content/maps/` with a meetup number and
`status: planned`. Entries written by `add-map-link` have neither key; this is the step
that schedules them.

## 1. Resolve the entries

The user may give ids, names or URLs ("the Amsterdam metro one", "train jazz").

```sh
ls src/content/maps | sed 's/\.md$//' | grep -i <fragment>
grep -ril <fragment> src/content/maps          # falls back to name/url/description
```

Resolve each to an id (the filename without `.md`). If a fragment matches several entries,
list the candidates and ask which. If it matches none, say so — don't create a new entry
here, that's the `add-map-link` skill.

"everything unplanned" means every entry with no `status:` line:

```sh
grep -L '^status:' src/content/maps/*.md | xargs -n1 basename | sed 's/\.md$//'
```

## 2. Pick the meetup

Default is the next upcoming meetup, resolved for you by the script:

```sh
node scripts/map-status.mjs --next-event   # {"number":9,"date":"2026-11-19"} or null
```

If it prints `null` there is no meetup dated today or later. Stop and tell the user to add
the next meetup file to `src/content/meetups/` first, or to name an existing event number —
don't attach the link to a meetup that has already happened.

If the user names a meetup ("#7", "the May one"), use that number instead.

## 3. Set event and status

```sh
node scripts/map-status.mjs <id ...> --event=next --status=planned
node scripts/map-status.mjs <id ...> --event=9 --status=planned   # a specific meetup
```

The script rewrites `event:` and `status:` in place (inserting them in the usual key order,
after `date:`), leaves the rest of the file alone, and prints the before → after for each
id. It refuses unknown ids and unknown event numbers.

Don't hand-edit the frontmatter for this; the script keeps the key order consistent.

## 4. Verify and report

```sh
npx prettier --write src/content/maps/<id>.md
npm run build 2>&1 | grep -iE "\[content\]|error" || true
```

Report which entries are now planned for which meetup (number and date), and note any the
user asked for that you couldn't resolve. Don't commit unless asked.
