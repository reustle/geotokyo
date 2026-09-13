import { projects, nextEvent, pastEvents } from '$lib/content';

export function load() {
	return {
		nextEvent,
		pastEvents,
		recentPast: pastEvents.slice(0, 3),
		recentProjects: projects.slice(0, 6),
		projectCount: projects.length
	};
}
