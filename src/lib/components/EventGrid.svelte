<script lang="ts">
	import type { Event } from '$lib/content/types';
	import EventCard from './EventCard.svelte';

	/** 2-up on mobile, 4-up on desktop. Optional trailing "earlier" card. */
	let {
		events,
		earlierHref,
		earlierLabel = 'Earlier meetups',
		earlierRange = ''
	}: {
		events: Event[];
		earlierHref?: string;
		earlierLabel?: string;
		earlierRange?: string;
	} = $props();
</script>

<div class="grid grid-cols-2 gap-5 md:grid-cols-4">
	{#each events as event (event.slug)}
		<EventCard {event} />
	{/each}
	{#if earlierHref}
		<a
			href={earlierHref}
			class="flex flex-col gap-[10px] text-muted no-underline hover:text-accent-hover"
		>
			<div
				class="grid aspect-video place-items-center border border-dashed border-rule-strong text-[12px]"
			>
				{earlierRange} →
			</div>
			<div class="text-[12px]">{earlierLabel}</div>
		</a>
	{/if}
</div>
