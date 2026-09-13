import { json } from '@sveltejs/kit';
import { links } from '$lib/content';

export const prerender = true;

/** Machine-readable export of every link, newest first. */
export function GET() {
	return json(
		links.map(
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
