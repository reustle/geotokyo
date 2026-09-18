<script lang="ts">
	import type { Photo } from '$lib/content/types';
	/**
	 * One or two photos sit side by side at 3:2. With more, the first photo spans 2x2
	 * and the rest fill a 4-column grid (2 on mobile).
	 */
	let { photos }: { photos: Photo[] } = $props();
	const few = $derived(photos.length <= 2);
</script>

<div
	class="grid gap-[6px] {few
		? 'md:grid-cols-2'
		: 'auto-rows-[120px] grid-cols-2 md:auto-rows-[170px] md:grid-cols-4'}"
>
	{#each photos as photo, i (photo.src)}
		<div
			class="relative overflow-hidden bg-bg-deep {few
				? 'aspect-[3/2]'
				: i === 0
					? 'col-span-2 row-span-2'
					: ''}"
		>
			<img
				src={photo.src}
				alt={photo.alt ?? ''}
				class="absolute inset-0 h-full w-full object-cover"
				loading="lazy"
			/>
		</div>
	{/each}
</div>
