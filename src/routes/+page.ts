import { links, nextEvent, pastEvents } from '$lib/content';

export function load() {
	return {
		nextEvent,
		pastEvents,
		recentPast: pastEvents.slice(0, 3),
		recentLinks: links.slice(0, 6),
		linkCount: links.length
	};
}
