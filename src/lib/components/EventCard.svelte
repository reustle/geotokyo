<script lang="ts">
	import type { Event } from '$lib/content/types';
	import EventCover from './EventCover.svelte';

	let { event }: { event: Event } = $props();
</script>

<a
	href="/meetups/{event.slug}"
	class="flex flex-col gap-[10px] text-ink no-underline hover:text-accent-hover"
>
	<EventCover {event} />
	<div class="flex flex-col gap-[2px] text-[13px] leading-[1.4]">
		<span>{event.title}</span>
		{#if event.subtitle}<span class="text-muted">{event.subtitle}</span>{/if}
	</div>
	{#if event.highlight}
		<div class="text-[11px] leading-[1.5] text-muted">{event.highlight}</div>
	{/if}
	<div class="text-[11px] text-faint">{event.date}</div>
</a>
