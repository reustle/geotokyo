import { projects, site } from '$lib/content';

export const prerender = true;

const esc = (s: string) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** RSS feed of projects, newest first. */
export function GET({ url }) {
	const base = url.origin;
	const items = projects
		.map(
			(l) => `
    <item>
      <title>${esc(l.name)}</title>
      <link>${esc(l.url.startsWith('http') ? l.url : `${base}/projects`)}</link>
      <guid isPermaLink="false">${esc(l.id)}</guid>
      <description>${esc(`${l.description} — ${l.tag} · shared at ${l.eventLabel}`)}</description>
      ${l.date ? `<pubDate>${new Date(l.date).toUTCString()}</pubDate>` : ''}
      <category>${esc(l.tag)}</category>
    </item>`
		)
		.join('');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(site.title)} · projects</title>
    <link>${base}/projects</link>
    <description>${esc(site.projectsBlurb)}</description>${items}
  </channel>
</rss>`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' }
	});
}
