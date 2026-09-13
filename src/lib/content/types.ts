import type { Component } from 'svelte';

/** Shape of a module produced by mdsvex for a content `.md` file. */
export interface MarkdownModule<T> {
	metadata: T;
	default: Component;
}

export interface NavItem {
	label: string;
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
	linksIntro: string;
	linksBlurb: string;
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

/** `src/content/events/*.md` */
export interface EventFrontmatter {
	number: number;
	title: string;
	/** Short name used where `#N` is not descriptive enough, e.g. "Summer 2026". */
	shortName?: string;
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
}

export interface Event extends EventFrontmatter {
	slug: string;
	color: string;
	ink: string;
	/** `#8` */
	label: string;
	/** True when the date is today or in the future (evaluated at build time). */
	upcoming: boolean;
	body: Component;
}

export type LinkStatus = 'discussed' | 'planned';

/** `src/content/links/*.md` */
export interface LinkFrontmatter {
	name: string;
	url: string;
	description: string;
	tag: string;
	/** Event number the link was shared at (or is planned for). */
	event: number;
	status?: LinkStatus;
	image?: string;
	/** Optional ISO date used for ordering; defaults to the event's date. */
	date?: string;
}

export interface Link extends LinkFrontmatter {
	id: string;
	host: string;
	status: LinkStatus;
	date: string;
	/** `#8`, or the event's short name for upcoming events. */
	eventLabel: string;
	eventColor: string;
	eventSlug?: string;
	body: Component;
}
