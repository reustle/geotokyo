<script lang="ts">
	import type { NavItem } from '$lib/content/types';
	import Wordmark from './Wordmark.svelte';

	/**
	 * Top chrome. `overlay` is used on the home hero where the header sits on top
	 * of the contour background; elsewhere it gets its own bottom rule.
	 */
	let {
		nav,
		coordinates,
		overlay = false,
		current = ''
	}: { nav: NavItem[]; coordinates: string; overlay?: boolean; current?: string } = $props();

	let menuOpen = $state(false);
	const toggle = () => (menuOpen = !menuOpen);
	const close = () => (menuOpen = false);

	const isCurrent = (href: string) => current !== '' && href === current;
</script>

<header
	class="relative flex items-center justify-between gap-4 px-5 py-[18px] text-[12px] md:px-12 md:py-6
		{overlay ? '' : 'border-b border-rule'}"
>
	<span class="hidden text-muted md:inline">{coordinates}</span>
	<Wordmark />
	<nav class="hidden gap-6 md:flex">
		{#each nav as item (item.href)}
			<a
				href={item.href}
				class="no-underline hover:text-accent-hover {isCurrent(item.href)
					? 'text-ink'
					: 'text-ink'}"
				aria-current={isCurrent(item.href) ? 'page' : undefined}>{item.label}</a
			>
		{/each}
	</nav>
	<button
		type="button"
		onclick={toggle}
		aria-expanded={menuOpen}
		aria-controls="mobile-nav"
		class="min-h-11 cursor-pointer border border-rule-heavy bg-transparent px-3 py-2 text-[11px] tracking-[.08em] text-ink md:hidden"
	>
		{menuOpen ? 'CLOSE' : 'MENU'}
	</button>
</header>

{#if menuOpen}
	<nav id="mobile-nav" class="relative flex flex-col border-t border-rule bg-bg/85 px-5 md:hidden">
		{#each nav as item, i (item.href)}
			<a
				href={item.href}
				onclick={close}
				class="py-[14px] text-[14px] text-ink no-underline {i < nav.length - 1
					? 'border-b border-rule'
					: ''}">{item.label}</a
			>
		{/each}
	</nav>
{/if}
