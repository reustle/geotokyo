/**
 * Content layer: reads markdown files under `src/content/**` (compiled by mdsvex)
 * and exposes typed, sorted collections. Everything here runs at build time when
 * the site is prerendered, so "upcoming" is relative to the build date.
 */
import type {
	Event,
	EventFrontmatter,
	Project,
	ProjectFrontmatter,
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
	'/src/content/events/*.md',
	{ eager: true }
);
const projectModules = import.meta.glob<MarkdownModule<ProjectFrontmatter>>(
	'/src/content/projects/*.md',
	{
		eager: true
	}
);
const organizerModules = import.meta.glob<MarkdownModule<OrganizerFrontmatter>>(
	'/src/content/organizers/*.md',
	{ eager: true }
);

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

function buildProjects(events: Event[]): Project[] {
	const byNumber = new Map(events.map((e) => [e.number, e]));
	return Object.entries(projectModules)
		.map(([path, mod]) => {
			const fm = mod.metadata;
			const ev = byNumber.get(fm.event);
			const status = fm.status ?? (ev?.upcoming ? 'planned' : 'discussed');
			return {
				...fm,
				status,
				id: slugOf(path),
				host: hostOf(fm.url),
				date: fm.date ? toIsoDate(fm.date) : (ev?.date ?? ''),
				eventLabel: ev ? (ev.upcoming && ev.shortName ? ev.shortName : ev.label) : `#${fm.event}`,
				eventColor: ev?.color ?? DEFAULT_COLOR,
				eventSlug: ev?.slug,
				body: mod.default
			} satisfies Project;
		})
		.sort(
			(a, b) => b.date.localeCompare(a.date) || b.event - a.event || a.name.localeCompare(b.name)
		);
}

export const site: Site = buildSite();
export const events: Event[] = buildEvents();
export const organizers: Organizer[] = buildOrganizers();
export const projects: Project[] = buildProjects(events);

/** Earliest event that has not happened yet, if any. */
export const nextEvent: Event | undefined = [...events]
	.filter((e) => e.upcoming)
	.sort((a, b) => a.date.localeCompare(b.date))[0];

/** Events that already happened, newest first. */
export const pastEvents: Event[] = events.filter((e) => !e.upcoming);

export function getEvent(slug: string): Event | undefined {
	return events.find((e) => e.slug === slug);
}

export function projectsForEvent(number: number): Project[] {
	return projects.filter((l) => l.event === number);
}

/** Distinct tags in the order they first appear (most recent projects first). */
export function projectTags(): string[] {
	return [...new Set(projects.map((l) => l.tag))];
}

/** `[{ event, count }]` for the projects sidebar, most recent event first. */
export function projectCountsByEvent(): {
	event: Event | undefined;
	label: string;
	color: string;
	count: number;
	planned: boolean;
}[] {
	const counts = new Map<number, number>();
	for (const l of projects) counts.set(l.event, (counts.get(l.event) ?? 0) + 1);
	return [...counts.entries()]
		.sort((a, b) => b[0] - a[0])
		.map(([number, count]) => {
			const event = events.find((e) => e.number === number);
			const sample = projects.find((l) => l.event === number)!;
			return {
				event,
				label: sample.eventLabel,
				color: sample.eventColor,
				count,
				planned: event?.upcoming ?? false
			};
		});
}
