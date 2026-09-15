#!/usr/bin/env node
/**
 * Fetch Open Graph thumbnails for map entries.
 *
 * For each src/content/maps/*.md without an `image:`, fetches the entry's `url`,
 * reads og:image (or twitter:image), downloads it to static/images/maps/<id>.<ext>
 * and adds `image: /images/maps/<id>.<ext>` to the frontmatter.
 *
 * Usage: node scripts/fetch-thumbnails.mjs [--force] [--dry-run] [id ...]
 */
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { findOgImage, get } from './lib/og.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const MAPS_DIR = path.join(ROOT, 'src/content/maps');
const OUT_DIR = path.join(ROOT, 'static/images/maps');
const EXT = {
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/webp': 'webp',
	'image/gif': 'gif',
	'image/avif': 'avif',
	'image/svg+xml': 'svg'
};

const args = process.argv.slice(2);
const force = args.includes('--force');
const dryRun = args.includes('--dry-run');
const only = new Set(args.filter((a) => !a.startsWith('--')));

function field(frontmatter, key) {
	const m = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
	if (!m) return undefined;
	return m[1].trim().replace(/^(['"])(.*)\1$/, '$2');
}

async function processEntry(file) {
	const id = path.basename(file, '.md');
	const src = await readFile(file, 'utf8');
	const fm = src.match(/^---\n([\s\S]*?)\n---/);
	if (!fm) return { id, status: 'skip', note: 'no frontmatter' };
	if (field(fm[1], 'image') && !force) return { id, status: 'skip', note: 'has image' };
	const url = field(fm[1], 'url');
	if (!url || !/^https?:\/\//.test(url)) return { id, status: 'skip', note: 'no http url' };

	const page = await get(url, 'text/html,application/xhtml+xml');
	if (!page.ok) return { id, status: 'fail', note: `page HTTP ${page.status}` };
	const html = await page.text();
	const og = findOgImage(html);
	if (!og) return { id, status: 'fail', note: 'no og:image' };
	const imageUrl = new URL(og, page.url).href;

	const img = await get(imageUrl, 'image/*');
	if (!img.ok) return { id, status: 'fail', note: `image HTTP ${img.status} ${imageUrl}` };
	const type = (img.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase();
	const ext = EXT[type];
	if (!ext) return { id, status: 'fail', note: `not an image (${type || 'no type'}) ${imageUrl}` };

	const publicPath = `/images/maps/${id}.${ext}`;
	if (!dryRun) {
		await mkdir(OUT_DIR, { recursive: true });
		await writeFile(path.join(OUT_DIR, `${id}.${ext}`), Buffer.from(await img.arrayBuffer()));
		const body = fm[1].match(/^image:.*$/m)
			? fm[1].replace(/^image:.*$/m, `image: ${publicPath}`)
			: `${fm[1]}\nimage: ${publicPath}`;
		await writeFile(file, src.replace(fm[0], `---\n${body}\n---`));
	}
	return { id, status: 'ok', note: `${publicPath} ← ${imageUrl}` };
}

const files = (await readdir(MAPS_DIR))
	.filter((f) => f.endsWith('.md') && (only.size === 0 || only.has(path.basename(f, '.md'))))
	.map((f) => path.join(MAPS_DIR, f));

const results = [];
for (let i = 0; i < files.length; i += 6) {
	const batch = files.slice(i, i + 6).map((f) =>
		processEntry(f).catch((err) => ({
			id: path.basename(f, '.md'),
			status: 'fail',
			note: err.name === 'TimeoutError' ? 'timeout' : err.message
		}))
	);
	for (const r of await Promise.all(batch)) {
		results.push(r);
		console.log(`${r.status.padEnd(4)} ${r.id}: ${r.note}`);
	}
}

const count = (s) => results.filter((r) => r.status === s).length;
console.log(
	`\n${count('ok')} fetched, ${count('fail')} failed, ${count('skip')} skipped${dryRun ? ' (dry run)' : ''}`
);
