import { linkCountsByEvent, links, linkTags } from '$lib/content';

export function load() {
	return { links, tags: linkTags(), byEvent: linkCountsByEvent() };
}
