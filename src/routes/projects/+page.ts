import { projectCountsByEvent, projects, projectTags } from '$lib/content';

export function load() {
	return { projects, tags: projectTags(), byEvent: projectCountsByEvent() };
}
