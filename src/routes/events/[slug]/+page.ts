import { error } from '@sveltejs/kit';
import { events, getEvent, projectsForEvent, nextEvent } from '$lib/content';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => events.map((e) => ({ slug: e.slug }));

export const load: PageLoad = ({ params }) => {
	const event = getEvent(params.slug);
	if (!event) error(404, 'No such event');
	return {
		event,
		eventProjects: projectsForEvent(event.number),
		nextEvent: nextEvent && nextEvent.slug !== event.slug ? nextEvent : undefined
	};
};
