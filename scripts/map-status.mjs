#!/usr/bin/env node
/**
 * Set the meetup and status of Map Links entries.
 *
 * Rewrites `event:` and `status:` in the frontmatter of src/content/maps/<id>.md,
 * inserting either key in the canonical order when it isn't there yet. Used by the
 * add-map-to-event and set-map-discussed skills.
 *
 * Usage: node scripts/map-status.mjs <id ...> [--event=<n>|next|none] [--status=planned|discussed|none]
 *        node scripts/map-status.mjs --next-event   # print the next upcoming meetup as JSON
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const MAPS_DIR = path.join(ROOT, 'src/content/maps');
const MEETUPS_DIR = path.join(ROOT, 'src/content/meetups');
/** Frontmatter key order used across src/content/maps. */
const KEY_ORDER = [
	'name',
	'url',
	'description',
	'tags',
	'date',
	'event',
	'status',
	'addedBy',
	'image'
];
const STATUSES = ['planned', 'discussed', 'none'];

const die = (msg) => {
	console.error(msg);
	process.exit(1);
};

const args = process.argv.slice(2);
const ids = args.filter((a) => !a.startsWith('--'));
const flag = (name) => {
	const hit = args.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
	return hit === undefined ? undefined : (hit.split('=')[1] ?? '');
};

/** Frontmatter block of a content file, as its raw lines. */
function splitFrontmatter(text, file) {
	const m = /^---\n([\s\S]*?)\n---(\n|$)/.exec(text);
	if (!m) die(`${file}: no frontmatter`);
	// `end` keeps the newline after the closing ---, so the body round-trips unchanged.
	return { lines: m[1].split('\n'), end: m.index + m[0].length - m[2].length };
}

function readKey(lines, key) {
	const line = lines.find((l) => new RegExp(`^${key}:`).test(l));
	return line === undefined
		? undefined
		: line
				.slice(key.length + 1)
				.trim()
				.replace(/^['"]|['"]$/g, '');
}

/** Sets `key: value` in `lines`, or removes the key when value is null. */
function setKey(lines, key, value) {
	const at = lines.findIndex((l) => new RegExp(`^${key}:`).test(l));
	if (value === null) {
		if (at !== -1) lines.splice(at, 1);
		return;
	}
	const line = `${key}: ${value}`;
	if (at !== -1) {
		lines[at] = line;
		return;
	}
	const before = KEY_ORDER.slice(0, KEY_ORDER.indexOf(key));
	let insertAt = 0;
	lines.forEach((l, i) => {
		const k = /^([A-Za-z]+):/.exec(l)?.[1];
		if (k && before.includes(k)) insertAt = i + 1;
	});
	lines.splice(insertAt, 0, line);
}

/** Every meetup as { number, date }, earliest first. */
async function meetups() {
	const files = (await readdir(MEETUPS_DIR)).filter((f) => f.endsWith('.md'));
	const all = await Promise.all(
		files.map(async (f) => {
			const { lines } = splitFrontmatter(await readFile(path.join(MEETUPS_DIR, f), 'utf8'), f);
			const date = readKey(lines, 'date');
			return { number: Number(readKey(lines, 'number')), date: date?.slice(0, 10) ?? '' };
		})
	);
	return all.sort((a, b) => a.date.localeCompare(b.date));
}

const todayIso = () => new Date().toLocaleDateString('en-CA');

async function nextEvent() {
	const today = todayIso();
	return (await meetups()).find((m) => m.date >= today);
}

if (flag('next-event') !== undefined) {
	const next = await nextEvent();
	console.log(JSON.stringify(next ?? null));
	process.exit(0);
}

const statusArg = flag('status');
const eventArg = flag('event');
if (statusArg === undefined && eventArg === undefined)
	die('Nothing to do: pass --status=... and/or --event=...');
if (statusArg !== undefined && !STATUSES.includes(statusArg))
	die(`--status must be one of: ${STATUSES.join(', ')}`);
if (!ids.length) die('Give at least one map link id (the filename without .md)');

let event;
if (eventArg !== undefined) {
	if (eventArg === 'next') {
		const next = await nextEvent();
		if (!next)
			die(
				`No meetup on or after ${todayIso()} in src/content/meetups. Add the next meetup first, or pass --event=<number>.`
			);
		event = next.number;
	} else if (eventArg === 'none') {
		event = null;
	} else {
		const known = await meetups();
		event = Number(eventArg);
		if (!Number.isInteger(event))
			die(`--event must be a number, "next" or "none" (got "${eventArg}")`);
		if (!known.some((m) => m.number === event))
			die(
				`No meetup #${event} in src/content/meetups (have: ${known.map((m) => m.number).join(', ')})`
			);
	}
}

for (const id of ids) {
	const file = path.join(MAPS_DIR, `${id}.md`);
	const text = await readFile(file, 'utf8').catch(() =>
		die(`No such entry: src/content/maps/${id}.md`)
	);
	const { lines, end } = splitFrontmatter(text, `${id}.md`);
	const was = { event: readKey(lines, 'event') || '—', status: readKey(lines, 'status') || '—' };

	if (eventArg !== undefined) setKey(lines, 'event', event);
	if (statusArg !== undefined) setKey(lines, 'status', statusArg === 'none' ? null : statusArg);

	await writeFile(file, `---\n${lines.join('\n')}\n---${text.slice(end)}`);
	const now = { event: readKey(lines, 'event') || '—', status: readKey(lines, 'status') || '—' };
	console.log(`${id}: event ${was.event} → ${now.event}, status ${was.status} → ${now.status}`);
}
