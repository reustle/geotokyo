<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Event } from '$lib/content/types';
	import Wordmark from './Wordmark.svelte';

	/**
	 * Coloured cover tile for an event. `card` is the 16:9 tile on event cards;
	 * `full` is the large cover block at the top of the event page.
	 */
	let {
		event,
		variant = 'card',
		children
	}: { event: Event; variant?: 'card' | 'full'; children?: Snippet } = $props();
</script>

{#if variant === 'card'}
	<div
		class="relative flex aspect-video items-start justify-between overflow-hidden p-[10px] font-display text-[14px] leading-none font-semibold"
		style="background:{event.color};color:{event.ink}"
	>
		{#if event.cover}
			<img src={event.cover} alt="" class="absolute inset-0 h-full w-full object-cover" />
		{/if}
		<Wordmark size="sm" href={null} class="relative" />
		<span class="relative">{event.label}</span>
	</div>
{:else}
	<div
		class="flex min-h-[400px] flex-col justify-between p-8"
		style="background:{event.color};color:{event.ink}"
	>
		<div
			class="flex items-start justify-between font-display text-[34px] leading-[.95] font-semibold"
		>
			<span>GEO TOKYO<br />MEETUP</span><span>{event.label}</span>
		</div>
		<div class="relative my-5 h-[200px]">
			{#if event.cover}
				<img src={event.cover} alt="" class="h-full w-full object-contain" />
			{/if}
		</div>
		{#if children}{@render children()}{/if}
	</div>
{/if}
