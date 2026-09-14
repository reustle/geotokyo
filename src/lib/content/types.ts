import type { Component } from 'svelte';

/** Shape of a module produced by mdsvex for a content `.md` file. */
export interface MarkdownModule<T> {
	metadata: T;
	default: Component;
}

export interface NavItem {
	label: string;
	/** Shorter label used on narrow screens, e.g. "JP Maps". */
	short?: string;
	href: string;
}

/** `src/content/site.md` */
export interface SiteFrontmatter {
	title: string;
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
	cover?: string;
	speakers?: Speaker[];
	schedule?: ScheduleItem[];
	photos?: Photo[];
	/** Projects presented at this event. */
	projects?: PresentedProject[];
	/** Ids of Japanese map entries (filenames in src/content/maps) discussed at this event. */
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
}

export type MapStatus = 'discussed' | 'planned';

/** `src/content/maps/*.md` — a Japanese mapping / geo project, dataset, map or post. */
export interface MapFrontmatter {
	name: string;
	url: string;
	description: string;
	/** One or more tags; these become the filter chips on /maps. `tag: data` (single) also works. */
	tags?: string[];
	tag?: string;
	/** Event number the entry was shared at (or is planned for). */
	event: number;
	status?: MapStatus;
	image?: string;
	/** Optional ISO date used for ordering; defaults to the event's date. */
	date?: string;
}

export interface JapaneseMap extends MapFrontmatter {
	id: string;
	host: string;
	/** Normalised tag list (never empty; falls back to "misc"). */
	tags: string[];
	status: MapStatus;
	date: string;
	/** `#8`, or the event's short name for upcoming events. */
	eventLabel: string;
	eventColor: string;
	eventSlug?: string;
	body: Component;
}
