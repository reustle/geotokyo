<script lang="ts">
	import type { JapaneseMap } from '$lib/content/types';
	/** Thumbnail for a entry; falls back to a labelled placeholder when no image is set. */
	let { entry, class: cls = '' }: { entry: JapaneseMap; class?: string } = $props();
</script>

<div class="relative overflow-hidden border border-rule bg-bg-deep {cls}">
	{#if entry.image}
		<img
			src={entry.image}
			alt=""
			class="absolute inset-0 h-full w-full object-cover"
			loading="lazy"
		/>
	{:else}
		<div
			class="absolute inset-0 grid place-items-center p-2 text-center text-[10px] leading-[1.4] break-all text-faint"
		>
			{entry.host}
		</div>
	{/if}
</div>
