import { json } from '@sveltejs/kit';
import { maps } from '$lib/content';

export const prerender = true;

/** Machine-readable export of every map link entry, newest first. */
export function GET() {
	return json(
		maps.map(
			({
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
				image,
				addedBy
			}) => ({
				id,
				name,
				url,
				description,
				host,
				tags,
				event,
				eventLabel,
				status: status ?? null,
				date,
				image: image ?? null,
				addedBy: addedBy ?? null
			})
		)
	);
}
