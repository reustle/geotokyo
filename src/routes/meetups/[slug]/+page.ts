import { error } from '@sveltejs/kit';
import { events, getEvent, mapsForEvent, nextEvent } from '$lib/content';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => events.map((e) => ({ slug: e.slug }));

export const load: PageLoad = ({ params }) => {
	const event = getEvent(params.slug);
	if (!event) error(404, 'No such event');
	return {
		event,
		eventMaps: mapsForEvent(event),
		nextEvent: nextEvent && nextEvent.slug !== event.slug ? nextEvent : undefined
	};
};
