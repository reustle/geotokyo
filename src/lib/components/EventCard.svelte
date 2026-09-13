<script lang="ts">
	import type { Event } from '$lib/content/types';
	import EventCover from './EventCover.svelte';

	let { event }: { event: Event } = $props();
</script>

<a
	href="/events/{event.slug}"
	class="flex flex-col gap-[10px] text-ink no-underline hover:text-accent-hover"
>
	<EventCover {event} />
	<div class="text-[13px] leading-[1.4]">{event.title}</div>
	{#if event.highlight}
		<div class="text-[11px] leading-[1.5] text-muted">{event.highlight}</div>
	{/if}
	<div class="text-[11px] text-faint">{event.date}</div>
</a>
