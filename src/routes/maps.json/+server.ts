import { json } from '@sveltejs/kit';
import { maps } from '$lib/content';

export const prerender = true;

/** Machine-readable export of every Japanese map entry, newest first. */
export function GET() {
	return json(
		maps.map(
			({ id, name, url, description, host, tags, event, eventLabel, status, date, image }) => ({
				id,
				name,
				url,
				description,
				host,
				tags,
				event,
				eventLabel,
				status,
				date,
				image: image ?? null
			})
		)
	);
}
