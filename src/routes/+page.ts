import { maps, nextEvent, pastEvents } from '$lib/content';

export function load() {
	return {
		nextEvent,
		pastEvents,
		recentPast: pastEvents.slice(0, 3),
		recentMaps: maps.slice(0, 6),
		mapCount: maps.length
	};
}
