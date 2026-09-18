/**
 * Content layer: reads markdown files under `src/content/**` (compiled by mdsvex)
 * and exposes typed, sorted collections. Everything here runs at build time when
 * the site is prerendered, so "upcoming" is relative to the build date.
 */
import type {
	Event,
	EventFrontmatter,
	JapaneseMap,
	MapFrontmatter,
	MapSort,
	MarkdownModule,
	Organizer,
	OrganizerFrontmatter,
	Site,
	SiteFrontmatter
} from './types';
import { hostOf, toIsoDate, todayIso } from './format';

const DEFAULT_COLOR = '#cf5a4e';
const DEFAULT_INK = '#141311';

const siteModules = import.meta.glob<MarkdownModule<SiteFrontmatter>>('/src/content/site.md', {
	eager: true
});
const eventModules = import.meta.glob<MarkdownModule<EventFrontmatter>>(
	'/src/content/meetups/*.md',
	{ eager: true }
);
/** Raw event sources, used to tell whether an event has any Markdown body. */
const eventSources = import.meta.glob<string>('/src/content/meetups/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
});
const mapModules = import.meta.glob<MarkdownModule<MapFrontmatter>>('/src/content/maps/*.md', {
	eager: true
});
const organizerModules = import.meta.glob<MarkdownModule<OrganizerFrontmatter>>(
	'/src/content/organizers/*.md',
	{ eager: true }
);

/** The only tags map links may use; each becomes a filter chip on /maps. */
export const MAP_TAGS = [
	'3d',
	'dataset',
	'basemap',
	'illustration',
	'transit',
	'visualization',
	'japan',
	'historical',
	'api',
	'tool'
] as const;

function normaliseTags(tags?: string[], tag?: string): string[] {
	const list = (tags ?? (tag ? [tag] : []))
		.map((t) => String(t).trim().toLowerCase())
		.filter(Boolean);
	return list.length ? [...new Set(list)] : ['misc'];
}

function slugOf(path: string): string {
	return path.split('/').pop()!.replace(/\.md$/, '');
}

function buildSite(): Site {
	const mod = Object.values(siteModules)[0];
	if (!mod) throw new Error('Missing src/content/site.md');
	return { ...mod.metadata, body: mod.default };
}

function buildEvents(): Event[] {
	const today = todayIso();
	return Object.entries(eventModules)
		.map(([path, mod]) => {
			const fm = mod.metadata;
			const date = toIsoDate(fm.date);
			return {
				...fm,
				date,
				slug: slugOf(path),
				color: fm.color ?? DEFAULT_COLOR,
				ink: fm.ink ?? DEFAULT_INK,
				label: `#${fm.number}`,
				upcoming: date >= today,
				projects: (fm.projects ?? []).map((p) => ({ ...p, host: p.url ? hostOf(p.url) : '' })),
				body: mod.default,
				hasBody: (eventSources[path] ?? '').replace(/^---\n[\s\S]*?\n---\n?/, '').trim() !== ''
			} satisfies Event;
		})
		.sort((a, b) => b.number - a.number);
}

function buildOrganizers(): Organizer[] {
	return Object.entries(organizerModules)
		.map(([path, mod]) => ({ ...mod.metadata, slug: slugOf(path), body: mod.default }))
		.sort((a, b) => (a.order ?? 99) - (b.order ?? 99) || a.name.localeCompare(b.name));
}

function buildMaps(events: Event[]): JapaneseMap[] {
	const byNumber = new Map(events.map((e) => [e.number, e]));
	return Object.entries(mapModules)
		.map(([path, mod]) => {
			const fm = mod.metadata;
			const ev = fm.event != null ? byNumber.get(fm.event) : undefined;
			const date = fm.date ? toIsoDate(fm.date) : (ev?.date ?? '');
			if (!date) {
				console.warn(
					`[content] maps/${slugOf(path)}.md has no date and no known event; set \`date:\`.`
				);
			}
			const tags = normaliseTags(fm.tags, fm.tag);
			const unknown = tags.filter((t) => !(MAP_TAGS as readonly string[]).includes(t));
			if (unknown.length) {
				console.warn(
					`[content] maps/${slugOf(path)}.md uses unknown tags: ${unknown.join(', ')}. Allowed: ${MAP_TAGS.join(', ')}.`
				);
			}
			// A link with no event hasn't been scheduled yet, so it has no status.
			const status =
				fm.status ?? (fm.event != null ? (ev?.upcoming ? 'planned' : 'discussed') : undefined);
			return {
				...fm,
				status,
				id: slugOf(path),
				host: hostOf(fm.url),
				tags,
				date,
				eventLabel: ev
					? ev.upcoming && ev.subtitle
						? ev.subtitle
						: ev.label
					: fm.event != null
						? `#${fm.event}`
						: undefined,
				eventColor: ev?.color ?? DEFAULT_COLOR,
				eventSlug: ev?.slug,
				body: mod.default
			} satisfies JapaneseMap;
		})
		.sort(
			(a, b) =>
				b.date.localeCompare(a.date) ||
				(b.event ?? 0) - (a.event ?? 0) ||
				a.name.localeCompare(b.name)
		);
}

export const site: Site = buildSite();
export const events: Event[] = buildEvents();
export const organizers: Organizer[] = buildOrganizers();
export const maps: JapaneseMap[] = buildMaps(events);

/** Earliest event that has not happened yet, if any. */
export const nextEvent: Event | undefined = [...events]
	.filter((e) => e.upcoming)
	.sort((a, b) => a.date.localeCompare(b.date))[0];

/** Events that already happened, newest first. */
export const pastEvents: Event[] = events.filter((e) => !e.upcoming);

export function getEvent(slug: string): Event | undefined {
	return events.find((e) => e.slug === slug);
}

/**
 * Map links discussed at an event, alphabetical by name: entries tagged with the
 * event number, plus any ids listed in the event's `maps:` frontmatter.
 */
export function mapsForEvent(event: Event): JapaneseMap[] {
	const ids = new Set(event.maps ?? []);
	return maps
		.filter((m) => m.event === event.number || ids.has(m.id))
		.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
}

/** Sort options offered on /maps, in the order the buttons appear. */
export const MAP_SORTS: { value: MapSort; label: string }[] = [
	{ value: 'date', label: 'newest' },
	{ value: 'name', label: 'a–z' }
];

/**
 * Copy of `entries` ordered by when the link was added (newest first, the default)
 * or alphabetically by name. Never mutates the input.
 */
export function sortMaps(entries: JapaneseMap[], order: MapSort = 'date'): JapaneseMap[] {
	const byName = (a: JapaneseMap, b: JapaneseMap) =>
		a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });
	return [...entries].sort((a, b) =>
		order === 'name'
			? byName(a, b)
			: b.date.localeCompare(a.date) || (b.event ?? 0) - (a.event ?? 0) || byName(a, b)
	);
}

/** Distinct tags, alphabetical, across the given entries (default: every entry). */
export function mapTags(entries: JapaneseMap[] = maps): string[] {
	return [...new Set(entries.flatMap((m) => m.tags))].sort();
}
