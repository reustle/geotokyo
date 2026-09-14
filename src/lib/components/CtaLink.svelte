<script lang="ts">
	import type { Snippet } from 'svelte';
	/** Solid accent call-to-action link. */
	let {
		href,
		size = 'lg',
		block = false,
		class: cls = '',
		children
	}: {
		href: string;
		size?: 'lg' | 'md';
		block?: boolean;
		class?: string;
		children: Snippet;
	} = $props();

	const external = $derived(/^https?:\/\//.test(href));
</script>

<a
	{href}
	target={external ? '_blank' : undefined}
	rel={external ? 'noopener' : undefined}
	class="inline-block bg-accent text-center text-[12px] whitespace-nowrap text-canvas no-underline transition-colors duration-150 hover:bg-accent-hover hover:text-canvas
		{size === 'lg' ? 'px-[22px] py-[15px] tracking-[.08em]' : 'px-4 py-3 tracking-[.06em]'}
		{block ? 'w-full' : ''} {cls}"
>
	{@render children()}
</a>
