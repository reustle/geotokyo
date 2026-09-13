<script lang="ts">
	/** Stacked GEO / TOKYO wordmark in Oswald. */
	let {
		variant = 'header',
		href = '/',
		class: cls = ''
	}: { variant?: 'header' | 'footer' | 'cover'; href?: string | null; class?: string } = $props();

	const sizes = {
		header: 'text-[22px] tracking-[.02em] text-center',
		footer: 'text-[28px]',
		cover: 'text-[14px]'
	} as const;
</script>

{#if href}
	<a
		{href}
		class="font-display leading-[.9] font-semibold text-ink no-underline hover:text-ink {sizes[
			variant
		]} {cls}"
	>
		{#if variant === 'footer'}GEO<br />TO<br />KYO{:else}GEO<br />TOKYO{/if}
	</a>
{:else}
	<span class="font-display leading-[.9] font-semibold {sizes[variant]} {cls}">
		{#if variant === 'footer'}GEO<br />TO<br />KYO{:else}GEO<br />TOKYO{/if}
	</span>
{/if}
