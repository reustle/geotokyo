<script lang="ts">
	import type { JapaneseMap } from '$lib/content/types';
	import MapThumb from './MapThumb.svelte';

	/** List row for the Japanese Maps index: thumbnail, title, description, host and tags. */
	let { entry }: { entry: JapaneseMap } = $props();
</script>

<a
	href={entry.url}
	class="grid grid-cols-[64px_minmax(0,1fr)] items-start gap-[14px] border-t border-rule py-[18px] text-ink no-underline hover:text-accent-hover md:grid-cols-[120px_minmax(0,1fr)] md:gap-6"
>
	<MapThumb {entry} class="aspect-square md:aspect-[3/2]" />
	<div class="flex min-w-0 flex-col gap-2 pt-[2px]">
		<div class="text-[16px] leading-[1.35]">{entry.name}</div>
		<div class="max-w-[640px] text-[13px] leading-[1.6] text-muted">{entry.description}</div>
		<div class="mt-[2px] flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-faint">
			<span>↗ {entry.host}</span>
			{#each entry.tags as tag (tag)}
				<span class="border border-rule-mid px-[6px] py-[1px]">{tag}</span>
			{/each}
		</div>
	</div>
</a>
