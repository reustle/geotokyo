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
const mapModules = import.meta.glob<MarkdownModule<MapFrontmatter>>('/src/content/maps/*.md', {
	eager: true
});
const organizerModules = import.meta.glob<MarkdownModule<OrganizerFrontmatter>>(
	'/src/content/organizers/*.md',
	{ eager: true }
);

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
				body: mod.default
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
			const ev = byNumber.get(fm.event);
			const status = fm.status ?? (ev?.upcoming ? 'planned' : 'discussed');
			return {
				...fm,
				status,
				id: slugOf(path),
				host: hostOf(fm.url),
				tags: normaliseTags(fm.tags, fm.tag),
				date: fm.date ? toIsoDate(fm.date) : (ev?.date ?? ''),
				eventLabel: ev ? (ev.upcoming && ev.subtitle ? ev.subtitle : ev.label) : `#${fm.event}`,
				eventColor: ev?.color ?? DEFAULT_COLOR,
				eventSlug: ev?.slug,
				body: mod.default
			} satisfies JapaneseMap;
		})
		.sort(
			(a, b) => b.date.localeCompare(a.date) || b.event - a.event || a.name.localeCompare(b.name)
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
 * Japanese maps discussed at an event: entries tagged with the event number,
 * plus any ids listed in the event's `maps:` frontmatter.
 */
export function mapsForEvent(event: Event): JapaneseMap[] {
	const ids = new Set(event.maps ?? []);
	return maps.filter((m) => m.event === event.number || ids.has(m.id));
}

/** Distinct tags, alphabetical, across every entry. */
export function mapTags(): string[] {
	return [...new Set(maps.flatMap((m) => m.tags))].sort();
}
