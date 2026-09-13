import { organizers, site } from '$lib/content';

// The whole site is static content; prerender every route at build time.
export const prerender = true;

export function load() {
	return { site, organizers };
}
