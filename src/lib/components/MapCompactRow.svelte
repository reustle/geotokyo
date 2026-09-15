<script lang="ts">
	import type { JapaneseMap } from '$lib/content/types';
	/** One-line entry row used on event pages. */
	let { entry }: { entry: JapaneseMap } = $props();

	const external = $derived(/^https?:\/\//.test(entry.url));
</script>

<a
	href={entry.url}
	target={external ? '_blank' : undefined}
	rel={external ? 'noopener' : undefined}
	class="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 border-b border-dashed border-rule-mid py-[10px] text-[13px] text-ink no-underline hover:text-accent-hover md:grid-cols-[minmax(0,1fr)_auto_auto]"
>
	<span>{entry.name} <span class="text-[12px] text-faint">— {entry.description}</span></span>
	<span class="text-[11px] text-faint">{entry.tags.join(' · ')}</span>
	<span class="col-span-2 text-[11px] text-faint md:col-span-1">{entry.host}</span>
</a>
