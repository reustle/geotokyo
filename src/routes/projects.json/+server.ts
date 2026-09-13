import { json } from '@sveltejs/kit';
import { projects } from '$lib/content';

export const prerender = true;

/** Machine-readable export of every project, newest first. */
export function GET() {
	return json(
		projects.map(
			({ id, name, url, description, host, tag, event, eventLabel, status, date, image }) => ({
				id,
				name,
				url,
				description,
				host,
				tag,
				event,
				eventLabel,
				status,
				date,
				image: image ?? null
			})
		)
	);
}
