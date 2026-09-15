#!/usr/bin/env node
/**
 * Print a page's metadata as JSON, for drafting a new map link entry.
 *
 * Output: { url, finalUrl, status, title, description, siteName, lang, image, existing }
 * `existing` lists src/content/maps ids whose `url` already points at the same page.
 *
 * Usage: node scripts/link-meta.mjs <url>
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { findPageMeta, get } from './lib/og.mjs';

const MAPS_DIR = path.resolve(import.meta.dirname, '../src/content/maps');

const url = process.argv[2];
if (!url || !/^https?:\/\//.test(url)) {
	console.error('Usage: node scripts/link-meta.mjs <http(s) url>');
	process.exit(2);
}

/** Loose comparison key: host without www, path without trailing slash, no hash. */
function key(u) {
	try {
		const p = new URL(u);
		return `${p.host.replace(/^www\./, '')}${p.pathname.replace(/\/+$/, '')}${p.search}`;
	} catch {
		return u;
	}
}

const existing = [];
for (const f of await readdir(MAPS_DIR)) {
	if (!f.endsWith('.md')) continue;
	const src = await readFile(path.join(MAPS_DIR, f), 'utf8');
	const m = src.match(/^url:\s*["']?([^"'\n]+)["']?\s*$/m);
	if (m && key(m[1]) === key(url)) existing.push(path.basename(f, '.md'));
}

const out = { url, existing };
try {
	const res = await get(url, 'text/html,application/xhtml+xml');
	out.finalUrl = res.url;
	out.status = res.status;
	if (res.ok) Object.assign(out, findPageMeta(await res.text(), res.url));
} catch (err) {
	out.error = err.name === 'TimeoutError' ? 'timeout' : err.message;
}
console.log(JSON.stringify(out, null, 2));
