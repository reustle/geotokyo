<script lang="ts">
	import type { NavItem } from '$lib/content/types';
	import Wordmark from './Wordmark.svelte';

	/**
	 * Top chrome: wordmark on the left, nav on the right at every width.
	 * `overlay` is used on the home hero where the header sits on top of the
	 * contour background; elsewhere it gets its own bottom rule.
	 */
	let {
		nav,
		overlay = false,
		current = ''
	}: { nav: NavItem[]; overlay?: boolean; current?: string } = $props();

	const isCurrent = (href: string) => current !== '' && href === current;
</script>

<header
	class="relative flex items-center justify-between gap-4 px-5 py-[18px] text-[12px] md:px-12 md:py-6
		{overlay ? '' : 'border-b border-rule'}"
>
	<Wordmark />
	<nav class="flex gap-5 md:gap-6">
		{#each nav as item (item.href)}
			<a
				href={item.href}
				class="py-2 text-ink no-underline hover:text-accent-hover"
				aria-current={isCurrent(item.href) ? 'page' : undefined}
			>
				<span class="md:hidden">{item.short ?? item.label}</span>
				<span class="hidden md:inline">{item.label}</span>
			</a>
		{/each}
	</nav>
</header>
