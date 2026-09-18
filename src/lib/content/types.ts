import type { Component } from 'svelte';

/** Shape of a module produced by mdsvex for a content `.md` file. */
export interface MarkdownModule<T> {
	metadata: T;
	default: Component;
}

export interface NavItem {
	label: string;
	/** Shorter label used on narrow screens, e.g. "Maps". */
	short?: string;
	href: string;
}

/** `src/content/site.md` */
export interface SiteFrontmatter {
	title: string;
	/** Default page description, also used for Open Graph / social previews. */
	description: string;
	tagline: string;
	coordinates: string;
	lumaUrl: string;
	githubUrl: string;
	newsletterBlurb: string;
	mapsIntro: string;
	mapsBlurb: string;
	nav: NavItem[];
}

export interface Site extends SiteFrontmatter {
	body: Component;
}

/** `src/content/organizers/*.md` */
export interface OrganizerFrontmatter {
	name: string;
	role: string;
	photo?: string;
	order?: number;
}

export interface Organizer extends OrganizerFrontmatter {
	slug: string;
	body: Component;
}

export interface Speaker {
	name: string;
	role?: string;
	talk?: string;
	photo?: string;
	note?: string;
}

export interface ScheduleItem {
	time: string;
	what: string;
}

export interface Photo {
	src: string;
	alt?: string;
}

/** A project presented at an event, written inline in the event file. */
export interface PresentedProject {
	name: string;
	url?: string;
	/** Who presented it. */
	by?: string;
	description?: string;
}

export interface PresentedProjectResolved extends PresentedProject {
	host: string;
}

/** `src/content/meetups/*.md` */
export interface EventFrontmatter {
	number: number;
	title: string;
	/** Shown under the title, e.g. "Summer 2026". Also labels upcoming events on /maps. */
	subtitle?: string;
	/** ISO date, quoted in YAML: "2026-09-17" */
	date: string;
	startTime?: string;
	endTime?: string;
	venue: string;
	city?: string;
	hosts?: string[];
	/** Cover colour + ink colour used when no cover image is provided. */
	color?: string;
	ink?: string;
	/** One-line summary used on cards. */
	highlight?: string;
	lumaUrl?: string;
	/** Meetup.com page for the older events (2020–2022). */
	meetupUrl?: string;
	cover?: string;
	speakers?: Speaker[];
	schedule?: ScheduleItem[];
	photos?: Photo[];
	/** Projects presented at this event. */
	projects?: PresentedProject[];
	/** Ids of map link entries (filenames in src/content/maps) discussed at this event. */
	maps?: string[];
}

export interface Event extends EventFrontmatter {
	slug: string;
	color: string;
	ink: string;
	/** `#8` */
	label: string;
	/** True when the date is today or in the future (evaluated at build time). */
	upcoming: boolean;
	projects: PresentedProjectResolved[];
	body: Component;
	/** False when the Markdown file has only frontmatter. */
	hasBody: boolean;
}

export type MapStatus = 'discussed' | 'planned';

/** Order of the Map Links list: newest first, or alphabetical by name. */
export type MapSort = 'date' | 'name';

/** `src/content/maps/*.md` — a map link: a map, dataset, geo project, example or post. */
export interface MapFrontmatter {
	name: string;
	url: string;
	description: string;
	/** One or more tags; these become the filter chips on /maps. `tag: data` (single) also works. */
	tags?: string[];
	tag?: string;
	/** Optional event number the entry was shared at (or is planned for). */
	event?: number;
	/** Only set once the link is scheduled for a meetup (`planned`) or has been shown (`discussed`). */
	status?: MapStatus;
	image?: string;
	/** ISO date the link was added. Backfilled from the event's date for older entries without one. */
	date?: string;
	/** Who added the link. */
	addedBy?: string;
}

export interface JapaneseMap extends MapFrontmatter {
	id: string;
	host: string;
	/** Normalised tag list (never empty; falls back to "misc"). */
	tags: string[];
	/** Resolved status, or undefined for a link not tied to a meetup yet. */
	status?: MapStatus;
	/** Resolved date: `date`, else the event's date, else '' (sorts last). */
	date: string;
	/** `#8`, or the event's subtitle for upcoming events. Undefined when no event is set. */
	eventLabel?: string;
	eventColor: string;
	eventSlug?: string;
	body: Component;
}
