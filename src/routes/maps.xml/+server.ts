import { maps, site } from '$lib/content';

export const prerender = true;

const esc = (s: string) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** RSS feed of maps, newest first. */
export function GET({ url }) {
	const base = url.origin;
	const items = maps
		.map(
			(l) => `
    <item>
      <title>${esc(l.name)}</title>
      <link>${esc(l.url.startsWith('http') ? l.url : `${base}/maps`)}</link>
      <guid isPermaLink="false">${esc(l.id)}</guid>
      <description>${esc(`${l.description} — ${l.tags.join(', ')}${l.eventLabel ? ` · shared at ${l.eventLabel}` : ''}`)}</description>
      ${l.date ? `<pubDate>${new Date(l.date).toUTCString()}</pubDate>` : ''}
      ${l.tags.map((t) => `<category>${esc(t)}</category>`).join('')}
    </item>`
		)
		.join('');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(site.title)} · Map links</title>
    <link>${base}/maps</link>
    <description>${esc(site.mapsBlurb)}</description>${items}
  </channel>
</rss>`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' }
	});
}
