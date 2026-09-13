<script lang="ts">
	import type { Link } from '$lib/content/types';
	/** Thumbnail for a link; falls back to a labelled placeholder when no image is set. */
	let { link, class: cls = '' }: { link: Link; class?: string } = $props();
</script>

<div class="relative overflow-hidden border border-rule bg-bg-deep {cls}">
	{#if link.image}
		<img
			src={link.image}
			alt=""
			class="absolute inset-0 h-full w-full object-cover"
			loading="lazy"
		/>
	{:else}
		<div
			class="absolute inset-0 grid place-items-center p-2 text-center text-[10px] leading-[1.4] text-faint"
		>
			{link.host}
		</div>
	{/if}
</div>
