<script lang="ts">
	import type { Snippet } from 'svelte';
	import { isRasterImage } from '$lib/content/format';
	import type { Event } from '$lib/content/types';
	import Wordmark from './Wordmark.svelte';

	/**
	 * Coloured cover tile for an event. `card` is the 16:9 tile on event cards;
	 * `full` is the large cover block at the top of the event page.
	 * A raster `cover` is a finished cover photo and is shown on its own, without
	 * the wordmark and label; an SVG `cover` is a logo set inside the tile.
	 */
	let {
		event,
		variant = 'card',
		children
	}: { event: Event; variant?: 'card' | 'full'; children?: Snippet } = $props();

	const photo = $derived(isRasterImage(event.cover));
</script>

{#if variant === 'card'}
	<div
		class="relative flex aspect-video items-start justify-between overflow-hidden p-[10px] font-display text-[14px] leading-none font-semibold"
		style="background:{event.color};color:{event.ink}"
	>
		{#if event.cover}
			<img src={event.cover} alt="" class="absolute inset-0 h-full w-full object-cover" />
		{/if}
		{#if !photo}
			<Wordmark size="sm" href={null} class="relative" />
			<span class="relative">{event.label}</span>
		{/if}
	</div>
{:else if photo}
	<div
		class="flex flex-col justify-between md:min-h-[400px]"
		style="background:{event.color};color:{event.ink}"
	>
		<img src={event.cover} alt="" class="block w-full" />
		{#if children}<div class="p-8">{@render children()}</div>{/if}
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
