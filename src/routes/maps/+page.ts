import { maps, mapTags } from '$lib/content';

export function load() {
	return { maps, tags: mapTags() };
}
