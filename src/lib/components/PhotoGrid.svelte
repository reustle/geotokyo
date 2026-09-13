<script lang="ts">
	import type { Photo } from '$lib/content/types';
	/** First photo spans 2x2; the rest fill a 4-column grid (2 on mobile). */
	let { photos }: { photos: Photo[] } = $props();
</script>

<div class="grid auto-rows-[120px] grid-cols-2 gap-[6px] md:auto-rows-[170px] md:grid-cols-4">
	{#each photos as photo, i (photo.src)}
		<div class="relative overflow-hidden bg-bg-deep {i === 0 ? 'col-span-2 row-span-2' : ''}">
			<img
				src={photo.src}
				alt={photo.alt ?? ''}
				class="absolute inset-0 h-full w-full object-cover"
				loading="lazy"
			/>
		</div>
	{/each}
</div>
