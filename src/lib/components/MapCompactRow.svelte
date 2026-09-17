<script lang="ts">
	import type { JapaneseMap } from '$lib/content/types';
	import MapThumb from './MapThumb.svelte';

	/** Compact entry row with a small thumbnail, used on event pages. */
	let { entry }: { entry: JapaneseMap } = $props();

	const external = $derived(/^https?:\/\//.test(entry.url));
</script>

<a
	href={entry.url}
	target={external ? '_blank' : undefined}
	rel={external ? 'noopener' : undefined}
	class="grid grid-cols-[48px_minmax(0,1fr)] items-start gap-x-[14px] border-b border-dashed border-rule-mid py-[10px] text-[13px] text-ink no-underline hover:text-accent-hover md:grid-cols-[72px_minmax(0,1fr)] md:gap-x-4"
>
	<MapThumb {entry} class="aspect-square md:aspect-[3/2]" />
	<div class="grid min-w-0 gap-x-4 gap-y-1 md:grid-cols-[minmax(0,1fr)_auto_auto]">
		<span>{entry.name} <span class="text-[12px] text-faint">— {entry.description}</span></span>
		<span class="text-[11px] text-faint">
			{entry.tags.join(' · ')} <span class="md:hidden">· {entry.host}</span>
		</span>
		<span class="hidden text-[11px] text-faint md:inline">{entry.host}</span>
	</div>
</a>
