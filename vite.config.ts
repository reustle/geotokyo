import { mdsvex } from 'mdsvex';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';

/** Rehype plugin: open external links in Markdown content in a new tab. */
function externalLinksNewTab() {
	type Node = {
		type: string;
		tagName?: string;
		properties?: Record<string, unknown>;
		children?: Node[];
	};
	const visit = (node: Node) => {
		const href = node.properties?.href;
		if (node.tagName === 'a' && typeof href === 'string' && /^https?:\/\//.test(href)) {
			node.properties!.target = '_blank';
			node.properties!.rel = ['nofollow', 'noopener'];
		}
		node.children?.forEach(visit);
	};
	return (tree: Node) => visit(tree);
}

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true,
				// mdsvex still emits <script context="module"> for frontmatter; not fixable from content.
				warningFilter: (warning) =>
					!(
						warning.code === 'script_context_deprecated' &&
						/\.(md|svx)$/.test(warning.filename ?? '')
					)
			},
			adapter: adapter({ fallback: '404.html' }),
			// Absolute URLs in prerendered output (RSS feed). Set SITE_ORIGIN at build time.
			prerender: { origin: process.env.SITE_ORIGIN ?? 'http://localhost:4173' },
			preprocess: [mdsvex({ extensions: ['.svx', '.md'], rehypePlugins: [externalLinksNewTab] })],
			extensions: ['.svelte', '.svx', '.md']
		})
	],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'client',
					browser: {
						enabled: true,
						provider: playwright(),
						instances: [{ browser: 'chromium', headless: true }]
					},
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**']
				}
			},

			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
