---
name: set-map-discussed
description: Mark Geo Tokyo Map Links entries as discussed — sets `status: discussed` in src/content/maps/<id>.md, for links that have now been shown at a meetup. Use when the user says a link was discussed/covered/shown, that they went through the agenda, or asks to close out the links from a meetup. For scheduling a link for a future meetup use add-map-to-event.
---

# Mark a map link as discussed

Sets `status: discussed` on one or more entries in `src/content/maps/`.

## 1. Resolve the entries

The user may give ids, names or URLs ("the Amsterdam metro one"), or a whole meetup
("everything from #8", "the links we just went through").

```sh
ls src/content/maps | sed 's/\.md$//' | grep -i <fragment>
grep -ril <fragment> src/content/maps               # name/url/description
grep -l '^event: 8$' src/content/maps/*.md          # every entry tagged to meetup 8
```

Resolve each to an id (the filename without `.md`). Ask when a fragment is ambiguous; say so
when it matches nothing rather than guessing.

For a whole meetup, take the entries tagged to it that are still `status: planned`, list them
for the user, and mark them together. Entries already `discussed` need no change.

## 2. Set the status

```sh
node scripts/map-status.mjs <id ...> --status=discussed
```

The script rewrites `status:` in place (inserting it after `date:`/`event:` when missing),
leaves everything else alone, and prints the before → after per id.

If an entry has no `event:` and the user said which meetup it was discussed at, set that in
the same run so the link shows up on the event page:

```sh
node scripts/map-status.mjs <id ...> --event=8 --status=discussed
```

Don't invent an event number when the user didn't name one — `status: discussed` on its own
is fine.

## 3. Verify and report

```sh
npx prettier --write src/content/maps/<id>.md
npm run build 2>&1 | grep -iE "\[content\]|error" || true
```

List what changed (id, and the event it's credited to when one is set) and anything you
couldn't resolve. Don't commit unless asked.
