#!/usr/bin/env node
/**
 * Set a map link's thumbnail by hand.
 *
 * Saves the image to static/images/maps/<id>.<ext>, shrinks it to at most 1200px wide
 * (macOS `sips`), and writes `image:` into src/content/maps/<id>.md.
 *
 * Usage:
 *   node scripts/set-thumbnail.mjs <id> <file>          local image (png, jpg, webp, gif, svg)
 *   node scripts/set-thumbnail.mjs <id> <image-url>     download an image
 *   node scripts/set-thumbnail.mjs <id> clipboard       image on the macOS clipboard
 *   node scripts/set-thumbnail.mjs <id> screenshot      screenshot the entry's url
 *     [--url=<page>]      screenshot a different page
 *     [--wait=<ms>]       extra wait after load for maps/tiles to draw (default 4000)
 *     [--selector=<css>]  screenshot one element instead of the viewport
 *     [--dark]            emulate prefers-color-scheme: dark
 */
import { execFileSync } from 'node:child_process';
import { copyFile, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { get } from './lib/og.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const MAPS_DIR = path.join(ROOT, 'src/content/maps');
const OUT_DIR = path.join(ROOT, 'static/images/maps');
const MAX_WIDTH = 1200;
const EXT = {
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/webp': 'webp',
	'image/gif': 'gif',
	'image/avif': 'avif',
	'image/svg+xml': 'svg'
};

const args = process.argv.slice(2);
const flag = (name) =>
	args
		.find((a) => a.startsWith(`--${name}`))
		?.split('=')
		.slice(1)
		.join('=');
const has = (name) => args.some((a) => a === `--${name}` || a.startsWith(`--${name}=`));
const [id, source] = args.filter((a) => !a.startsWith('--'));

function die(msg) {
	console.error(msg);
	process.exit(1);
}

if (!id || !source)
	die('Usage: node scripts/set-thumbnail.mjs <id> <file|image-url|clipboard|screenshot>');
const entryFile = path.join(MAPS_DIR, `${id}.md`);
if (!existsSync(entryFile)) die(`No entry src/content/maps/${id}.md`);

const src = await readFile(entryFile, 'utf8');
const fm = src.match(/^---\n([\s\S]*?)\n---/);
if (!fm) die(`${id}.md has no frontmatter`);
const field = (key) =>
	fm[1]
		.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]
		.trim()
		.replace(/^(['"])(.*)\1$/, '$2');

const tmp = await mkdtemp(path.join(os.tmpdir(), 'geotokyo-thumb-'));

/** Produces a local file in `tmp`; returns { file, ext, photo } where photo = safe to re-encode as JPEG. */
async function acquire() {
	if (source === 'clipboard') {
		const file = path.join(tmp, 'clipboard.png');
		try {
			execFileSync('osascript', [
				'-e',
				`set f to open for access POSIX file "${file}" with write permission`,
				'-e',
				'write (the clipboard as «class PNGf») to f',
				'-e',
				'close access f'
			]);
		} catch {
			die('No image on the clipboard (copy a screenshot with ⌃⇧⌘4 first).');
		}
		return { file, ext: 'png', photo: true };
	}

	if (source === 'screenshot') {
		const url = flag('url') ?? field('url');
		if (!url || !/^https?:\/\//.test(url)) die('No http(s) url to screenshot; pass --url=');
		const { chromium } = await import('playwright');
		const opts = { headless: true };
		let browser;
		try {
			browser = await chromium.launch({ ...opts, channel: 'chrome' });
		} catch {
			browser = await chromium.launch(opts); // bundled Chromium (npx playwright install)
		}
		try {
			const page = await browser.newPage({
				viewport: { width: 1200, height: 800 },
				deviceScaleFactor: 1,
				colorScheme: has('dark') ? 'dark' : 'light'
			});
			await page.goto(url, { waitUntil: 'load', timeout: 45000 });
			await page.waitForTimeout(Number(flag('wait') ?? 4000));
			const file = path.join(tmp, 'screenshot.png');
			const selector = flag('selector');
			if (selector) await page.locator(selector).first().screenshot({ path: file });
			else await page.screenshot({ path: file });
			console.log(`screenshot of ${url}`);
			return { file, ext: 'png', photo: true };
		} finally {
			await browser.close();
		}
	}

	if (/^https?:\/\//.test(source)) {
		const res = await get(source, 'image/*');
		if (!res.ok) die(`HTTP ${res.status} fetching ${source}`);
		const type = (res.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase();
		const ext = EXT[type];
		if (!ext)
			die(
				`Not an image (${type || 'no content-type'}). For a web page use: ${id} screenshot --url=${source}`
			);
		const file = path.join(tmp, `download.${ext}`);
		await writeFile(file, Buffer.from(await res.arrayBuffer()));
		return { file, ext, photo: false };
	}

	const local = path.resolve(source.replace(/^~(?=\/)/, os.homedir()));
	if (!existsSync(local)) die(`File not found: ${local}`);
	let ext = path.extname(local).slice(1).toLowerCase();
	if (ext === 'jpeg') ext = 'jpg';
	if (!Object.values(EXT).includes(ext)) die(`Unsupported image type: .${ext}`);
	const file = path.join(tmp, `local.${ext}`);
	await copyFile(local, file);
	return { file, ext, photo: false };
}

function dims(file) {
	const out = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], {
		encoding: 'utf8'
	});
	return [
		Number(out.match(/pixelWidth: (\d+)/)?.[1]),
		Number(out.match(/pixelHeight: (\d+)/)?.[1])
	];
}

try {
	let { file, ext, photo } = await acquire();

	if (['png', 'jpg'].includes(ext)) {
		const [w] = dims(file);
		if (w > MAX_WIDTH)
			execFileSync('sips', ['--resampleWidth', String(MAX_WIDTH), file], { stdio: 'ignore' });
		// Screenshots are photographic; JPEG is far smaller. Hand-picked PNGs may need transparency.
		if (photo && ext === 'png') {
			const jpg = path.join(tmp, 'out.jpg');
			execFileSync(
				'sips',
				['-s', 'format', 'jpeg', '-s', 'formatOptions', '82', file, '--out', jpg],
				{
					stdio: 'ignore'
				}
			);
			file = jpg;
			ext = 'jpg';
		}
	}

	const publicPath = `/images/maps/${id}.${ext}`;
	const dest = path.join(OUT_DIR, `${id}.${ext}`);
	const previous = field('image');
	await copyFile(file, dest);
	if (previous && previous !== publicPath && previous.startsWith(`/images/maps/${id}.`)) {
		await rm(path.join(ROOT, 'static', previous), { force: true });
		console.log(`removed old ${previous}`);
	}

	const body = /^image:.*$/m.test(fm[1])
		? fm[1].replace(/^image:.*$/m, `image: ${publicPath}`)
		: `${fm[1]}\nimage: ${publicPath}`;
	await writeFile(entryFile, src.replace(fm[0], `---\n${body}\n---`));

	const size = (await stat(dest)).size;
	const [w, h] = ['png', 'jpg'].includes(ext) ? dims(dest) : [];
	console.log(`ok ${id}: ${publicPath}${w ? ` ${w}×${h}` : ''} ${Math.round(size / 1024)} KB`);
} finally {
	await rm(tmp, { recursive: true, force: true });
}
