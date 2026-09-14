<script lang="ts">
	/**
	 * GEO / TOKYO text lockup in Oswald. Always two rows, left aligned.
	 * Renders as a link to `/` unless `href` is null (e.g. inside another link).
	 */
	let {
		size = 'md',
		href = '/',
		class: cls = ''
	}: { size?: 'sm' | 'md' | 'lg'; href?: string | null; class?: string } = $props();

	const sizes = {
		sm: 'text-[14px]',
		md: 'text-[22px] tracking-[.02em]',
		lg: 'text-[28px] tracking-[.02em]'
	} as const;

	const base = 'inline-block text-left font-display leading-[.9] font-semibold';
</script>

{#if href}
	<a {href} class="{base} text-ink no-underline hover:text-ink {sizes[size]} {cls}"
		>GEO<br />TOKYO</a
	>
{:else}
	<span class="{base} {sizes[size]} {cls}">GEO<br />TOKYO</span>
{/if}
