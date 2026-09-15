/** Shared helpers for reading Open Graph metadata from web pages. */

export const UA = 'Mozilla/5.0 (compatible; GeoTokyoThumbnailBot/1.0; +https://geotokyo.com)';
const TIMEOUT_MS = 15000;

export function decodeEntities(s) {
	return s
		.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
		.replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
		.replace(/&quot;/g, '"')
		.replace(/&apos;/g, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&amp;/g, '&');
}

/** Collects <meta property|name=... content=...> pairs; the first value for each key wins. */
export function readMetas(html) {
	const metas = html.match(/<meta\b[^>]*>/gi) ?? [];
	const found = {};
	for (const tag of metas) {
		const key = tag.match(/\b(?:property|name)\s*=\s*["']([^"']+)["']/i)?.[1]?.toLowerCase();
		const content = tag.match(/\bcontent\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
		if (!key || !content) continue;
		found[key] ??= decodeEntities(content[1] ?? content[2]).trim();
	}
	return found;
}

/** Returns the first og:image / twitter:image content found in the HTML head. */
export function findOgImage(html) {
	const found = readMetas(html);
	return (
		found['og:image:secure_url'] ??
		found['og:image'] ??
		found['og:image:url'] ??
		found['twitter:image'] ??
		found['twitter:image:src']
	);
}

/** Title, description, site name and image for a page, from OG/Twitter tags with HTML fallbacks. */
export function findPageMeta(html, baseUrl) {
	const found = readMetas(html);
	const htmlTitle = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
	const image = findOgImage(html);
	return {
		title:
			found['og:title'] ??
			found['twitter:title'] ??
			(htmlTitle ? decodeEntities(htmlTitle).replace(/\s+/g, ' ').trim() : undefined),
		description: found['og:description'] ?? found['twitter:description'] ?? found['description'],
		siteName: found['og:site_name'] ?? found['application-name'],
		lang: html.match(/<html\b[^>]*\blang\s*=\s*["']([^"']+)["']/i)?.[1],
		image: image ? new URL(image, baseUrl).href : undefined
	};
}

export async function get(url, accept) {
	return fetch(url, {
		headers: { 'user-agent': UA, accept },
		redirect: 'follow',
		signal: AbortSignal.timeout(TIMEOUT_MS)
	});
}
