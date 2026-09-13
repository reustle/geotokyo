import { events } from '$lib/content';

export function load() {
	return {
		upcoming: events.filter((e) => e.upcoming).sort((a, b) => a.date.localeCompare(b.date)),
		past: events.filter((e) => !e.upcoming)
	};
}
